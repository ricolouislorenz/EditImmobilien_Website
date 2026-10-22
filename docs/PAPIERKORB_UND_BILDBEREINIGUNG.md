# Papierkorb und ungenutzte Bilder

ÜBERGABE ADMIN-04 / SPEICHER: Im Code umgesetzt und lokal getestet. Supabase-Einrichtung 0006 und sämtliche erwarteten Kontrollwerte wurden vom Nutzer bestätigt. Veröffentlichung, GitHub-Einrichtung und Live-Test sind noch nicht bestätigt. Durch die lokale Umsetzung wurden keine echten Immobilien oder Bilder gelöscht.

## Bedienung im Adminbereich

**Löschen** verschiebt eine Immobilie für **30 Tage in den Papierkorb**. Sie verschwindet von der Website; ihre Bilder bleiben während dieser Frist erhalten. Unten in der Immobilienübersicht den **Papierkorb öffnen** und bei Bedarf **Wiederherstellen** wählen. Der Eintrag erscheint wieder öffentlich, mit derselben Objektnummer und seinen Bildern, am Ende seines Bereichs. Die Position kann anschließend angepasst werden.

Die Oberfläche meldet Erfolg erst nach Bestätigung der betroffenen Immobilien-ID. Wurde der Eintrag inzwischen verändert, fehlen Rechte oder geht die Antwort verloren, bleibt die Anzeige zunächst erhalten. Über **Neu laden** den tatsächlichen Stand prüfen. Ein fehlgeschlagener Wiederherstellungsversuch entfernt den Papierkorbeintrag nicht.

Nach 30 Tagen ist die Wiederherstellung gesperrt. Beim nächsten echten Bereinigungslauf werden abgelaufene Papierkorbeinträge endgültig entfernt. Der Papierkorb ersetzt keine unabhängige Sicherung. Er schützt nur Löschungen nach seiner Einrichtung; bereits früher gelöschte Inhalte lassen sich damit nicht zurückholen. Bilder im öffentlichen Bucket bleiben während der Aufbewahrung über bekannte Links abrufbar.

## Schritt 1: Supabase vor Veröffentlichung vorbereiten

1. Offene Immobilienbearbeitungen abschließen. Das richtige Supabase-Projekt öffnen; Einrichtung **0005** muss bereits erfolgreich sein.
2. Im **SQL Editor → New query** die vollständige Datei [0006_property_trash_and_image_cleanup.sql](../supabase/migrations/0006_property_trash_and_image_cleanup.sql) als **postgres** mit **Run** ausführen. Bestehende Immobilien und Storage-Dateien werden dabei nicht verändert.
3. Bei einem Fehler stoppen und den Fehlertext prüfen lassen. Keine Teilstücke nachholen. Falls eine fehlgeschlagene Transaktion offen bleibt, zunächst `ROLLBACK;` ausführen und nach Prüfung die gesamte Datei erneut ausführen.
4. [papierkorb_pruefen.sql](../supabase/setup/papierkorb_pruefen.sql) ausführen. **Überall muss `true` stehen; nur `gaeste_duerfen_wiederherstellen` muss `false` sein.** Die Kontrolle verändert keine Daten.
5. Nach erfolgreicher Kontrolle den Code committen, pushen und das Cloudflare-Deployment abwarten. Adminbereich vollständig neu laden.

Die Migration ist wiederholbar. Sie legt einen geschützten Papierkorb und Schutzregeln an. Die eigentliche Dateilöschung erfolgt ausschließlich über die Supabase Storage API. In SQL werden nur Papierkorbeinträge und eigene Schutzdaten verwaltet; Storage-Metadaten werden nicht gelöscht.

## Schritt 2: Hintergrundlauf in GitHub vorbereiten

Die Bereinigung läuft unabhängig vom geöffneten Adminbereich über GitHub Actions. **Sie bleibt zunächst ausgeschaltet.**

Im GitHub-Repository unter **Settings → Secrets and variables → Actions**:

- **Secret `VITE_SUPABASE_URL`:** Die URL desselben Projekts wie auf der Website. Sie wird bereits für den vorhandenen Keep-Alive-Lauf verwendet; den vorhandenen Wert gegebenenfalls beibehalten.
- **Neues Secret `SUPABASE_SERVICE_ROLE_KEY`:** Den serverseitigen Supabase-Service-Role-Schlüssel hinterlegen. Er besitzt weitreichende Rechte. Niemals als `VITE_`-Variable, in Git, in Logs oder in den Websitecode kopieren. Auch nicht als Textnachricht weitergeben.

Unter **Actions → Immobilien-Bildspeicher bereinigen → Run workflow** zunächst ohne Häkchen bei **delete_unused** starten. Das ist eine reine Vorschau: keine Reservierungen, keine Dateilöschungen und kein Entfernen abgelaufener Papierkorbeinträge. Im Log erscheinen Anzahl und Pfade der Kandidaten, höchstens 100 je Lauf.

Vor dem ersten echten Lauf prüfen: richtiges Projekt, aktuelle Sicherung, plausible Kandidaten und keine darin erwarteten Bilder. Erst danach denselben Workflow mit aktiviertem **delete_unused** ausführen. Dieser entfernt abgelaufene Papierkorbeinträge und die bestätigten ungenutzten Dateien endgültig.

## Schritt 3: Tägliche Bereinigung einschalten

Nach erfolgreicher Vorschau und geprüftem ersten echten Lauf unter **Actions → Variables** die Repository-Variable **`PROPERTY_IMAGE_CLEANUP_ENABLED` auf `true`** setzen.

Der Workflow ist täglich für **04:20 UTC** vorgesehen; GitHub kann den Start verzögern. Pro Lauf werden höchstens 100 Dateien entfernt. Bei größeren Altbeständen sind mehrere Läufe nötig. Zum Pausieren die Variable auf `false` setzen oder entfernen. Manuelle Vorschauen bleiben möglich. Den Status der Actions-Läufe regelmäßig prüfen; fehlende Secrets, nicht erreichbares Supabase und unbestätigte Löschungen führen zu einem fehlgeschlagenen Lauf.

## Was die Bereinigung schützt

- **Aktuell verwendete Bilder** aller Immobilien und **Bilder im noch wiederherstellbaren Papierkorb** werden ausgeschlossen. Gemeinsam genutzte Bilder bleiben erhalten, solange ein Eintrag sie benötigt.
- Nur JPEG-, PNG- und WebP-Dateien im Schema **Immobilien-UUID/Dateiname** werden berücksichtigt. Andere Buckets, Root-Dateien wie Logos und unbekannte Ordner bleiben unangetastet. Solche Altdateien müssen gesondert geprüft werden.
- Dateien müssen **seit mindestens 48 Stunden bestehen und unverändert sein**. Das schützt neue Uploads und gibt bei unklaren Speicherantworten Zeit zur Prüfung. Ein seit mehr als 48 Stunden offenes, ungespeichertes Formular sollte neu geladen werden; entfernte Bilder gegebenenfalls erneut hochladen.
- Vor einer echten Löschung prüft die Datenbank die Verweise und reserviert die Pfade unter einer Schreibsperre. Danach können diese Pfade nicht neu gespeichert oder über die normale Website überschrieben werden. Die Reservierung bleibt auch nach einem Verbindungsabbruch erhalten; der nächste Lauf prüft verbleibende Dateien erneut.
- Gespeicherte relative Pfade sowie öffentliche und signierte Storage-URLs werden verglichen. Fehlerhafte Kodierungen stoppen die Prüfung, statt unsichere Löschungen zuzulassen.
- Die tatsächliche Löschbestätigung der Storage API wird ausgewertet. Eine fehlende Bestätigung gilt als Fehler. Die [Supabase-Dokumentation](https://supabase.com/docs/guides/storage/management/delete-objects) verlangt die Dateilöschung über die Storage API.

Vorhandene direkte Bereinigung nach erfolgreichen Bearbeitungen oder eindeutig fehlgeschlagenen Uploads bleibt erhalten; die neuen Storage-Regeln schützen dabei zusätzlich gemeinsam verwendete und archivierte Bilder. Der Hintergrundlauf fängt verbliebene Dateien auf. Bilder, die außerhalb dieses Projekts verlinkt, aber in keiner Immobilie oder keinem Papierkorbeintrag referenziert sind, sind für die Bereinigung ungenutzt. Externe Nutzung solcher Dateien vorher klären.

Direkte Eingriffe mit Service-Role-Schlüsseln oder über das Dashboard umgehen normale Browserregeln. Während der Bereinigung keine manuellen Storage-Umbenennungen, Überschreibungen oder Importarbeiten mit solchen Rechten durchführen. Bei später eingeschränkten Adminrollen auch die Rechte für Papierkorb und Wiederherstellung anpassen.

## Prüfen ohne echte Datenänderungen

```powershell
node --test --test-isolation=none tests/property-cleanup.test.mjs
$env:PROPERTY_SQL_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-pglite-tests/node_modules/@electric-sql/pglite'
node --test --test-isolation=none tests/property-trash-sql.test.mjs
$env:TURNSTILE_DOM_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-turnstile-tests/node_modules/jsdom'
node --test --test-isolation=none tests/property-trash-ui.test.mjs
```

Testabhängigkeiten siehe [SQL-Einrichtung 0004](../supabase/setup/ATOMARES_SPEICHERN.md) und [Upload-Testanleitung](SPEICHERN_UND_UPLOADS.md). Die Tests prüfen lokale Datenbanken und simulierte APIs; keine echten Dateien werden entfernt.

Nach Veröffentlichung eine abgestimmte Testimmobilie mit Bild in den Papierkorb verschieben, die öffentliche Anzeige kontrollieren, wiederherstellen und Bild sowie Objektnummer prüfen. Die echte Bildbereinigung erst nach der beschriebenen Vorschau aktivieren.
