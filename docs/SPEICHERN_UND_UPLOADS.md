# Immobilien speichern: Uploads und Fehlerfälle

ÜBERGABE ADMIN-01: Upload-Absicherung und gemeinsames Speichern von Reihenfolge und Datensatz sind lokal geprüft. Die [SQL-Einrichtung 0004](../supabase/setup/ATOMARES_SPEICHERN.md) in Supabase und korrekte Kontrollwerte wurden vom Nutzer bestätigt. Veröffentlichung und Live-Prüfung dieses Schritts sind noch nicht bestätigt.

## Was jetzt abgesichert ist

- Neue Bilder erhalten zufällige, eindeutige Dateinamen statt eines reinen Zeitstempels. Gleichzeitige Uploads gleichartiger Dateien kollidieren dadurch nicht mehr.
- Alle Dateien werden vor dem ersten Upload geprüft. Scheitert ein einzelner Upload, wartet der Code die übrigen Ergebnisse ab und versucht erst danach, ausschließlich die neuen Dateien dieses Versuchs aufzuräumen.
- Reihenfolge und Datensatz werden in einem Datenbankaufruf gespeichert. Scheitert ein Teil, nimmt PostgreSQL sämtliche Änderungen dieses Aufrufs zurück. Bestehende Zugriffsrechte gelten weiterhin.
- Lehnt PostgreSQL das Speichern ausdrücklich wegen ungültiger Werte, verletzter Datenbankbedingungen oder fehlender Rechte ab, werden neue Uploads aufgeräumt. Andere Fehler werden vorsichtshalber als unklar eingestuft.
- Bricht die Speicherantwort ab oder fehlt die Bestätigung, werden weder neue noch alte Bilder gelöscht. Die Speicherung könnte bereits erfolgt sein. Das Formular sperrt erneutes Speichern und bietet einen Link zum erneuten Laden des betroffenen Datensatzes.
- Ein laufender Speichervorgang kann nicht doppelt abgesendet werden. Ein erlaubter neuer Versuch nach einer eindeutigen Ablehnung verwendet bei neuen Immobilien dieselbe Immobilien-ID.
- Alte Bilder werden erst nach bestätigtem Speichern entfernt. Die tatsächliche Löschbestätigung wird ausgewertet; bloßes Ausbleiben einer Fehlermeldung genügt nicht. Bei gescheiterter Bildbereinigung bleibt die erfolgreiche Speicherung bestehen und die Übersicht zeigt einen Hinweis.

## Bei einer Meldung im Adminbereich

| Meldung | Vorgehen |
| --- | --- |
| Bild-Upload fehlgeschlagen | Verbindung und Bilder prüfen, dann erneut versuchen. Bestehende Bilder werden hierbei nicht gelöscht. |
| Datenbank hat Speicherung abgelehnt | Eingaben beziehungsweise Berechtigungen prüfen. Bei einer kurzzeitigen Datenbanksperre später erneut versuchen. Direkt nach einer Veröffentlichung die technische Betreuung um Prüfung der SQL-Einrichtung bitten. |
| Dateien nicht vollständig aufgeräumt | Technische Betreuung um Prüfung des Bildspeichers bitten. Kein vollständiges Leeren des Buckets durchführen. |
| Speicherung nicht eindeutig bestätigt | Über **Gespeicherten Stand neu laden und prüfen** den tatsächlichen Datensatz kontrollieren. Bei fehlendem Datensatz oder widersprüchlichem Stand zunächst die technische Betreuung hinzuziehen, statt mehrfach neue Einträge anzulegen. |

Die Vollseiten-Navigation bei unklarem Ergebnis verwirft den lokalen Formularstand bewusst erst nach dem Klick auf den Prüf-Link. Die Übersicht ist alternativ erreichbar. Das Formular kann eine abgebrochene Antwort nicht als Beweis für einen verlorenen Datensatz behandeln.

## Technische Grenzen

Die Bereinigung läuft im Browser über die Supabase Storage API und ist keine dauerhafte Hintergrundaufgabe. Wird der Tab geschlossen oder fällt die Verbindung während der Bereinigung aus, können Restdateien verbleiben. Auch ein Upload mit abgebrochener Antwort kann serverseitig zeitversetzt fertig werden. Die Änderung versucht dessen bekannten neuen Pfad aufzuräumen; sie kann eine spätere Restdatei nicht ausschließen. Ein späterer Bereinigungsdienst müsste verwendete Bildpfade mit dem Speicherbestand abgleichen und ist nicht Teil dieses Schritts.

Die neue Funktion `save_property` fasst Umsortieren und Speichern in einer Transaktion zusammen. Eine Tabellensperre verhindert dazwischenliegende Schreibvorgänge; sie bricht nach fünf Sekunden Wartezeit ab. Bereits zuvor geladene Formulare können weiterhin veraltete Inhalte überschreiben. Der Schutz davor und die Beschränkung auf freigegebene Admin-Konten bleiben offen. Bilddateien liegen außerhalb der Datenbanktransaktion und werden weiterhin gesondert bereinigt.

Ausdrücklich als abgelehnt gelten [PostgreSQL-Fehlercodes](https://www.postgresql.org/docs/current/errcodes-appendix.html) der Klassen 22 (ungültige Daten), 23 (verletzte Bedingungen) sowie 42501 (unzureichende Rechte), 40001/40P01 (Transaktion abgebrochen) und 55P03 (Sperre nicht verfügbar). Auch [PostgREST PGRST202](https://docs.postgrest.org/en/stable/references/errors.html) bedeutet, dass die Funktion nicht aufgerufen werden konnte. Fehlende Bestätigungen und andere Fehler bleiben unklar. Dateien werden nur über die [Storage API](https://supabase.com/docs/guides/storage/management/delete-objects) entfernt, nicht durch SQL-Löschen ihrer Metadaten.

## Tests wiederholen

```sh
npm run test:property-uploads
npm run test:property-save
npm run test:image-upload
```

Die Tests prüfen unter anderem gleichzeitige Uploads, verspätete Antworten, Teilfehler, Bereinigungsfehler, ausdrückliche Datenbank-Ablehnung und unbekannte Speicherergebnisse. Keine echten Supabase-Zugriffe oder Bildlöschungen.

`tests/property-form-save.test.mjs` prüft zusätzlich die tatsächliche React-Oberfläche mit simuliertem Supabase: Doppelabsenden, die Sperre bei unklarem Ausgang und die unveränderte Immobilien-ID beim erlaubten neuen Versuch. Die lokale DOM-Testumgebung entspricht der [Turnstile-Testanleitung](TURNSTILE_EINRICHTUNG.md):

```powershell
$env:TURNSTILE_DOM_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-turnstile-tests/node_modules/jsdom'
node --test --test-isolation=none tests/property-form-save.test.mjs
```

## Nach Veröffentlichung prüfen

Mit abgestimmten Testimmobilien mehrere zulässige Bilder speichern, erneut öffnen und die Bildanzeige kontrollieren. Bei mindestens zwei Testeinträgen auch eine belegte Sortierposition wählen und die Reihenfolge nach erneutem Laden prüfen. Danach zuerst die Testbilder entfernen und speichern, anschließend die Testeinträge löschen. Fehlerfälle werden lokal simuliert; dafür keine Produktionsrechte verändern oder Bilder produktiver Angebote entfernen.
