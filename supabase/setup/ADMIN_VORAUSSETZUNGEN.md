# Objektnummern und Sortierfunktion ergänzen

Status: vom Nutzer in Supabase angewendet und per Kontrollabfrage bestätigt. Die ursprünglich fehlende Spalte `reference` und Funktion `shift_property_order` sind vorhanden. Auch der manuelle Funktionstest wurde vom Nutzer erfolgreich durchgeführt.

## Bestätigte Funktionstests

Am 22.10.2026 hat der Nutzer mit einer ausdrücklich bezeichneten Testimmobilie auf der Website bestätigt:

- Anlegen und öffentliche Anzeige mit automatischer Objektnummer `EI-001` funktionieren.
- Titeländerung wird gespeichert und öffentlich angezeigt; die Objektnummer bleibt erhalten.
- Bild-Upload, Speicherung und öffentliche Bildanzeige funktionieren.
- Entfernen des Bildes und erneutes Speichern funktionieren ohne gemeldeten Fehler.
- Die anschließende Löschung entfernt den Testeintrag aus der öffentlichen Anzeige.

Das sind Nutzerbestätigungen, keine eigenständig ausgeführten Live-Tests. Die tatsächliche Entfernung der Bilddatei aus Supabase Storage wurde nicht separat kontrolliert. Das Verschieben mehrerer Immobilien sowie die Ablehnung unzulässiger Uploads wurden live noch nicht geprüft. Die nachfolgende Anleitung bleibt für eine spätere Neueinrichtung erhalten.

## Was sich ändert

- Bestehende Immobilien erhalten eine eindeutige Objektnummer wie `EI-001`, geordnet nach Erstelldatum und danach ID. Neue Immobilien erhalten ihre Nummer automatisch. Bereits vorhandene gültige Nummern bleiben erhalten.
- Titel, Preise, Status, Bilder und die bisherige Sortierreihenfolge bleiben bei der Einrichtung erhalten. Immobilien werden nicht gelöscht.
- Die vom Admincode erwartete Sortierfunktion wird angelegt. Beim späteren Umsortieren rückt sie Einträge an einer belegten Zielposition nach hinten.
- Die Funktion arbeitet mit den bestehenden Rechten des aufrufenden Kontos. Gäste dürfen sie nicht aufrufen. Die weiterhin offene Beschränkung auf bestimmte Admin-Konten wird hierdurch nicht ersetzt.

## Anwenden

1. Während der Einrichtung soll niemand Immobilien bearbeiten. Vorher eine aktuelle Datenbanksicherung erstellen beziehungsweise die bestehende Wiederherstellungsmöglichkeit prüfen; die Datenbankänderung ergänzt dauerhaft Objektnummern.
2. Im bereits abgeglichenen Supabase-Projekt **SQL Editor → neue Abfrage** öffnen und die Rolle **postgres** verwenden.
3. Den **gesamten** Inhalt von [0003_property_admin_prerequisites.sql](../migrations/0003_property_admin_prerequisites.sql) einfügen und **Run** drücken. In diesem Schritt nur diese Datei ausführen; die älteren Dateien `0001` und `0002` sind dafür nicht zusätzlich nötig.
4. Die Einrichtung läuft innerhalb einer Transaktion. Bei einem Fehler nicht einzelne Teile nachholen: Fehlertext senden. Falls der Editor noch eine fehlgeschlagene Transaktion meldet, zunächst `ROLLBACK;` ausführen. Bei einer Sperrzeitüberschreitung die Bearbeitung der Immobilien beenden und anschließend die vollständige Datei erneut ausführen.
5. Nach Erfolg eine neue Abfrage öffnen und [admin_voraussetzungen_pruefen.sql](admin_voraussetzungen_pruefen.sql) vollständig ausführen. Diese Kontrolle liest nur Daten und technische Einstellungen.
6. Die Ergebniszeile hier teilen. `fehlende_nummern`, `ungueltige_nummern` und `doppelte_nummern` müssen `0` sein. Alle Prüfwerte müssen `true` sein, außer **gaeste_duerfen_umsortieren**, das `false` sein muss.

Die vollständige Einrichtung kann erneut ausgeführt werden. Vorhandene Nummern bleiben erhalten, der Zähler wird nicht zurückgesetzt. Nummern müssen nicht lückenlos sein: Abgebrochene Anlegeversuche können eine Nummer verbrauchen.

## Danach

Bei einer späteren Neueinrichtung die Adminseite neu laden und die Objektnummern kontrollieren. Einen echten Anlege-/Bearbeitungstest anschließend abstimmen; die Kontrollabfrage selbst legt keine Testimmobilie an. Ein kurzzeitig veralteter API-Schemacache kann einen erneuten Seitenaufruf erfordern; das Skript fordert dessen Aktualisierung an.

Diese Einrichtung behebt ausschließlich die fehlenden Datenbankvoraussetzungen. Die gemeinsame Absicherung von Umsortieren und Speichern ist im nächsten Schritt [0004](ATOMARES_SPEICHERN.md) vorbereitet und muss vor Veröffentlichung des neuen Admincodes eingerichtet werden. Die Admin-Freigabeliste und der Schutz vor gegenseitigem Überschreiben bleiben offen.

Fachliche Grundlagen: [Supabase-Datenbankfunktionen und Aufrufrechte](https://supabase.com/docs/guides/database/functions), [PostgreSQL-Sequenzen und transaktionaler Neustart](https://www.postgresql.org/docs/17/sql-altersequence.html).

## Technische Prüfung

`tests/property-schema.test.mjs` prüft die SQL-Datei in einer lokalen PostgreSQL-Umgebung mit PGlite und nachgebildeten Supabase-Rollen. Geprüft werden Datenerhalt, automatische Nummern einschließlich EI-1000, erneute Ausführung, Fehler-Rückabwicklung, alte eindeutige Indizes, Sortieren und verweigerte Gastzugriffe. Das ersetzt nicht die anschließende Kontrolle im echten Projekt; insbesondere Supabase-API und Schemacache werden lokal nicht nachgebildet.

Zum Wiederholen mit PowerShell kann PGlite außerhalb der Projektabhängigkeiten im temporären Ordner installiert werden:

```powershell
$sqlTestRoot = Join-Path $env:TEMP 'edit-immobilien-pglite-tests'
npm install --prefix $sqlTestRoot --no-save --package-lock=false --ignore-scripts --no-audit --no-fund @electric-sql/pglite@0.3.14
$env:PROPERTY_SQL_TEST_MODULE = Join-Path $sqlTestRoot 'node_modules/@electric-sql/pglite'
node --test --test-isolation=none tests/property-schema.test.mjs
```

Diese Tests benötigen keine Supabase-Zugangsdaten und ändern keine Live-Daten.
