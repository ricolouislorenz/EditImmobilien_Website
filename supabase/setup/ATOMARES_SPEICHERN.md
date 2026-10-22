# Reihenfolge und Immobilie gemeinsam speichern

ÜBERGABE ADMIN-01: Lokal umgesetzt und getestet. Einrichtung in Supabase und korrekte Kontrollwerte wurden vom Nutzer bestätigt; Veröffentlichung und Live-Test sind noch nicht bestätigt.

Bisher konnte die Reihenfolge bereits geändert sein, obwohl das anschließende Speichern scheiterte. Die neue Datenbankfunktion führt beide Änderungen gemeinsam aus. Bei einem Fehler bleibt der vorherige Datenbankstand bestehen. Bilder werden weiterhin getrennt hochgeladen und bei eindeutigen Fehlern zur Bereinigung angefordert.

## Einrichtung vor der Veröffentlichung

Die frühere Einrichtung **0003** muss abgeschlossen sein; das wurde für dieses Projekt bereits bestätigt. Es werden keine neuen Cloudflare-Variablen oder Secrets benötigt.

1. In Supabase das zu dieser Website gehörende Projekt öffnen und **SQL Editor → New query** wählen. Die Einrichtung mit der Rolle **postgres** ausführen.
2. Die gesamte Datei [0004_atomic_property_save.sql](../migrations/0004_atomic_property_save.sql) kopieren, einfügen und **Run** anklicken. Sie legt die Funktion an und setzt deren Aufrufrechte. Bestehende Immobilien werden dabei nicht geändert.
3. Bei einer Fehlermeldung stoppen und den Fehlertext prüfen lassen. Keine einzelnen Teile nachholen. Falls eine fehlgeschlagene Transaktion offen bleibt, `ROLLBACK;` ausführen. Bei einer Sperrzeitüberschreitung laufende Immobilienbearbeitung beenden und später die gesamte Datei erneut ausführen.
4. In einer neuen Abfrage [atomares_speichern_pruefen.sql](atomares_speichern_pruefen.sql) ausführen. Diese Kontrolle verändert keine Daten. **Alle Werte müssen `true` sein, außer `gaeste_duerfen_speichern`: dieser muss `false` sein.**
5. Erst nach erfolgreicher Kontrolle den neuen Websitecode committen, pushen und die Cloudflare-Veröffentlichung abwarten. Den Adminbereich danach vollständig neu laden.

Die Einrichtung ist wiederholbar. Die bisherige Sortierfunktion bleibt für die Übergangszeit vorhanden, damit der bisher veröffentlichte Code weiter funktioniert. Erst der neue Websitecode nutzt ausschließlich den gemeinsamen Speicheraufruf. Ohne 0004 kann dieser neue Code keine Immobilien speichern; es gibt keinen Rückfall auf den bisherigen Ablauf.

## Was abgesichert ist und was offen bleibt

- Nur angemeldete Nutzer können die Funktion aufrufen. Bestehende Tabellenrechte und Zeilenregeln gelten weiterhin; es werden keine zusätzlichen Schreibrechte vergeben.
- Geschützte Felder wie Immobiliennummer und Erstellungsdatum werden nicht aus dem Formular übernommen. Änderungszeit und neue Immobiliennummer bestimmt die Datenbank.
- Während des Speicherns werden andere Schreibvorgänge kurz angehalten. Nach fünf Sekunden Wartezeit wird abgebrochen. Öffentliches Lesen bleibt möglich.
- Bei einem Fehler werden auch bereits ausgeführte Verschiebungen dieses Aufrufs zurückgenommen. Eine verlorene Netzwerkantwort kann dennoch bedeuten, dass das Speichern erfolgreich war: Dann den gespeicherten Stand neu laden und prüfen.
- Die heutige Leseregel macht alle Immobilien sichtbar. Werden später Leserechte eingeschränkt, muss auch die gemeinsame Sortierung erneut geprüft werden.
- Veraltete Formulare können weiterhin neuere Inhalte überschreiben. Admin-Freigabeliste und dauerhafte Bereinigung ungenutzter Bilder sind eigene offene Schritte. Siehe [Details zu Uploads und Fehlerfällen](../../docs/SPEICHERN_UND_UPLOADS.md).

## Lokale Prüfung ohne Produktionsdaten

`tests/atomic-property-save.test.mjs` führt die Migration in einer lokalen PostgreSQL-Testumgebung aus. Geprüft werden Einrichtung und Aufrufrechte, Neuanlage, Bearbeitung, unveränderte Position, geschützte Felder sowie vollständiges Zurückrollen bei Datenfehlern und fehlenden Schreibrechten. Es erfolgen keine Zugriffe auf das echte Supabase-Projekt.

Mit Node.js ab 22.18 und der Testabhängigkeit in einem temporären Verzeichnis:

```powershell
$sqlTestDir = Join-Path $env:TEMP 'edit-immobilien-pglite-tests'
npm install --prefix $sqlTestDir --no-save --no-package-lock @electric-sql/pglite@0.3.14
$env:PROPERTY_SQL_TEST_MODULE = Join-Path $sqlTestDir 'node_modules/@electric-sql/pglite'
node --test --test-isolation=none tests/atomic-property-save.test.mjs
```

Nach Veröffentlichung den beschriebenen manuellen Test in der Upload-Dokumentation durchführen. Lokale Tests bestätigen noch keine erfolgreiche Einrichtung oder Auslieferung auf der Website.
