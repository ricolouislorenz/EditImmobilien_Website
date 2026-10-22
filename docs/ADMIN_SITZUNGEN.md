# Automatisches Abmelden im Adminbereich

ÜBERGABE ADMIN-SITZUNG: Im Code umgesetzt und lokal geprüft. SQL-Einrichtung, Veröffentlichung und Live-Test stehen noch aus.

## Verhalten für die Bedienung

- Nach **28 Minuten ohne Bedienung** erscheint eine Warnung. Über **Angemeldet bleiben** weiterarbeiten oder Änderungen rechtzeitig speichern.
- Nach **30 Minuten** wird der Adminbereich abgemeldet. Ungespeicherte Eingaben gehen dabei verloren; es gibt kein automatisches Speichern.
- Tastatur, Maus, Berührung und Scrollen im sichtbaren Browserfenster zählen als Bedienung. Automatische Token-Erneuerungen und reine Sitzungsprüfungen verlängern die Frist nicht.
- Tabs desselben Browsers teilen sich die Bedienaktivität derselben Anmeldung. Ein Neuladen startet die Frist nicht neu. Nach dem Ruhezustand wird die Frist vor weiterer Bedienung geprüft.
- Bei **erneuter Anmeldung desselben Kontos** wird die ältere Sitzung für diese Website ungültig. Die Oberfläche prüft alle 15 Sekunden und bei Rückkehr ins Fenster. Andere Admin-Konten können parallel arbeiten.
- Bei unterbrochener Verbindung wird die Bearbeitung gesperrt. Eingaben bleiben während dieser vorübergehenden Sperre erhalten; über **Erneut prüfen** fortfahren. Ist die Sitzung inzwischen abgelaufen oder ersetzt, muss erneut angemeldet werden.

## Vor Veröffentlichung in Supabase einrichten

Keine zusätzlichen Cloudflare-Secrets erforderlich. Die Lösung verwendet eigene Datenbankregeln; der Pro-Schalter „Single session per user“ ist dafür nicht erforderlich.

1. Laufende Immobilienbearbeitungen abschließen. Nach der SQL-Einrichtung benötigt der neue Admincode die Sitzungsprüfung; alte Browserversionen können dann nicht mehr schreiben.
2. **Das richtige Supabase-Projekt** öffnen. Im SQL Editor die vollständige Datei [0005_admin_sessions.sql](../supabase/migrations/0005_admin_sessions.sql) als **postgres** mit **Run** ausführen.
3. Bei einem Fehler stoppen und den Fehlertext prüfen lassen. Keine einzelnen Teile nachholen. Falls noch eine fehlgeschlagene Transaktion offen ist, zunächst `ROLLBACK;` ausführen. Bestehende Immobilien und Bilddateien werden durch die Einrichtung nicht geändert.
4. [admin_sitzungen_pruefen.sql](../supabase/setup/admin_sitzungen_pruefen.sql) in einer neuen Abfrage ausführen. **Alle Werte müssen `true` sein, außer `gaeste_duerfen_pruefen`: dieser muss `false` sein.**
5. Danach den Websitecode committen und pushen. Nach erfolgreichem Cloudflare-Deployment den Adminbereich vollständig neu laden und neu anmelden.

Die Einrichtung ist wiederholbar. Sie legt einen geschützten Sitzungsspeicher, zwei Funktionen und sechs zusätzliche Schreibregeln an. Bestehende Lese- und Schreibregeln bleiben erhalten; die zusätzlichen Regeln können Rechte nur einschränken. Die öffentliche Immobilien- und Bildanzeige bleibt unverändert.

## Technische Absicherung und Grenzen

`private.admin_sessions` speichert pro Konto die zuletzt bestätigte Sitzung und Bedienaktivität, keine Passwörter oder Tokens. Browser können diese Tabelle nicht direkt lesen oder ändern. `admin_session_check` prüft die eigene Kennung aus dem signierten Token gegen `auth.sessions`. Neuere Anmeldungen werden nach dem serverseitigen Erstellungszeitpunkt erkannt. Die Funktionen benötigen eingeschränkte erhöhte Leserechte; ihr Suchpfad ist festgelegt und nur angemeldete Personen dürfen sie aufrufen.

Die Schreibregeln für Immobilien sowie Upload, Änderung und Löschen im Bucket `property-images` prüfen zusätzlich die aktuelle Sitzung. Dadurch bleibt ein bereits ausgegebenes Token einer ersetzten oder abgelaufenen Sitzung für diese Schreibvorgänge gesperrt. Öffentliche Daten dürfen weiterhin gelesen werden. Eine begonnene Datenbankanfrage sieht den Stand ihrer Transaktion; bereits laufende Vorgänge werden durch eine neue Anmeldung nicht rückwirkend abgebrochen.

Die Website meldet eine beendete Sitzung mit `scope: local` ab. Dadurch wird die neuere Anmeldung auf dem anderen Gerät nicht mit abgemeldet. Geschlossene oder getrennte Browser können keine Abmeldeanzeige erhalten; der Schreibschutz wirkt unabhängig davon. Die eigene Regel beendet nicht pauschal sämtliche Supabase-Nutzungsmöglichkeiten: Andere Tabellen oder Dienste müssten bei einer Projekterweiterung gesondert abgesichert werden.

Die Datenbank erhält Bedienaktivität höchstens alle 15 Sekunden sowie beim Bestätigen der Warnung. Ihre Zeitgrenze bezieht sich auf die letzte bestätigte Meldung und kann deshalb geringfügig von der Browseranzeige abweichen. Bei längerer Unterbrechung kann eine erneute Anmeldung erforderlich sein. Bedienaktivität ist ein Browsersignal; ein absichtlich veränderter Client könnte Aktivität vortäuschen. Die Admin-Freigabeliste und der Schutz vor gegenseitigem Überschreiben zwischen verschiedenen Konten bleiben eigenständige offene Punkte.

Supabase dokumentiert die Zuordnung zwischen Token-Kennung und `auth.sessions` sowie die Prüfung abgemeldeter Sitzungen unter [User sessions](https://supabase.com/docs/guides/auth/sessions). Die eigene Umsetzung ersetzt keine allgemeine Sicherheitsfreigabe des Projekts.

## Lokal prüfen

```powershell
node --test --test-isolation=none tests/admin-session-monitor.test.mjs
$env:PROPERTY_SQL_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-pglite-tests/node_modules/@electric-sql/pglite'
node --test --test-isolation=none tests/admin-sessions-sql.test.mjs
$env:TURNSTILE_DOM_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-turnstile-tests/node_modules/jsdom'
node --test --test-isolation=none tests/admin-session-ui.test.mjs
```

Testabhängigkeiten wie in [SQL-Einrichtung 0004](../supabase/setup/ATOMARES_SPEICHERN.md) und [Upload-Testanleitung](SPEICHERN_UND_UPLOADS.md) beschrieben temporär installieren. Die Tests verwenden simulierte Zeit und Dienste sowie eine lokale Datenbank; keine echten Sitzungen werden beendet.

Nach Veröffentlichung: In zwei getrennten Browserprofilen dasselbe Konto anmelden. Das ältere Fenster muss innerhalb von ungefähr 15 Sekunden zur Anmeldung wechseln. Anschließend kontrollieren, dass das neuere Fenster weiter funktioniert. Im selben Browser zählen weitere Tabs zur gleichen Sitzung. Den Inaktivitätstest separat durchführen; dabei keine ungespeicherten produktiven Eingaben offenlassen.
