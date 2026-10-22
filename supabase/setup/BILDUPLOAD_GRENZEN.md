# Bild-Uploads in Supabase begrenzen

Status: vom Nutzer angewendet und per Kontrollabfrage bestätigt: JPEG, PNG und WebP sowie 10 MiB (10.485.760 Byte) im Bucket. Diese geringfügig höhere Servergrenze wurde akzeptiert; die Website bleibt bei 10 MB (10.000.000 Byte). Ein erlaubter Bild-Upload samt Anzeige und anschließendem Entfernen wurde vom Nutzer erfolgreich getestet. Die Ablehnung unzulässiger Uploads wurde live noch nicht geprüft. Die Begrenzung auf freigegebene Admin-Konten wurde zurückgestellt und ist weiterhin offen.

## Ziel

Im bestehenden Bucket `property-images` gelten für neue Uploads diese Werte:

| Einstellung | Wert |
| --- | --- |
| Maximale Dateigröße | **10.000.000 Byte = 10 MB** |
| Erlaubte MIME-Typen | `image/jpeg`, `image/png`, `image/webp` |

Die Einstellungen gelten unabhängig von der Website-Oberfläche. Vorhandene Bilder werden nicht gelöscht oder umgewandelt. Die öffentliche Abrufbarkeit und die bestehenden Zugriffsregeln werden in diesem Schritt nicht geändert. Die Grenze von 20 Bildern je Immobilie ist damit noch nicht serverseitig durchgesetzt.

## Im Dashboard einstellen

1. Im Supabase-Dashboard das bereits abgeglichene Projekt öffnen.
2. **Storage** öffnen und den vorhandenen Bucket **property-images** auswählen.
3. Die Einstellungen dieses Buckets öffnen, je nach Oberfläche über das Menü **…**, **Edit bucket** oder **Bucket settings**. Keinen neuen Bucket anlegen und keine globale Einstellung für alle Buckets bearbeiten.
4. Die Begrenzung der Dateigröße aktivieren, meist **Restrict file size**, und **10 MB** eintragen. Falls die Oberfläche Byte statt MB verlangt: **10000000**. Falls sie ausdrücklich MiB verwendet: **9,5367431640625 MiB** (bei englischer Zahleneingabe mit Punkt). 10 MiB wären 10.485.760 Byte und damit etwas mehr als die Website erlaubt. Den tatsächlich gespeicherten Wert prüfen wir unten.
5. Die Einschränkung der Dateitypen aktivieren, meist **Restrict MIME types**. Genau diese drei Werte hinterlegen, je nach Oberfläche einzeln oder kommasepariert:

   ```text
   image/jpeg,image/png,image/webp
   ```

6. Speichern. Andere Einstellungen unverändert lassen.

Es werden keine zusätzlichen Secrets oder Edge Functions benötigt. Für diese Änderung nutzen wir die Bucket-Einstellungen statt direkt in die von Supabase verwalteten Storage-Tabellen zu schreiben. Siehe [Storage-Schema](https://supabase.com/docs/guides/storage/schema/design) und [Bucket-Einstellungen](https://supabase.com/docs/guides/storage/buckets/creating-buckets).

## Ergebnis prüfen

Im **SQL Editor** eine neue Abfrage öffnen, den vollständigen Inhalt von [bildupload_grenzen_pruefen.sql](bildupload_grenzen_pruefen.sql) einfügen und **Run** drücken. Die Abfrage liest ausschließlich Bucket-Einstellungen und liefert eine Ergebniszeile.

- `bucket_vorhanden` muss `true` sein.
- `dateigroesse_max_bytes` muss `10000000` sein und `groesse_exakt_wie_website` muss `true` sein.
- `erlaubte_dateitypen` muss die drei oben genannten Formate enthalten und `formate_exakt_wie_website` muss `true` sein.
- `oeffentlich` soll wie im bisherigen Bericht `true` bleiben, damit bestehende Bildlinks weiter funktionieren.

Bitte das Ergebnis hier im Chat teilen. Falls die Größe etwa als `10485760` erscheint, wurde die Dashboard-Eingabe binär umgerechnet; dann passen wir die Eingabe gezielt an. Bei einer Fehlermeldung oder einem fehlenden Einstellungsfeld den Wortlaut beziehungsweise die angezeigten Felder mitteilen, ohne weitere Einstellungen zu ändern.

Die Kontrollabfrage prüft die gespeicherte Konfiguration, nicht den vollständigen Uploadweg. Ein globales Storage-Limit kann zusätzlich eine niedrigere Grenze vorgeben. Die MIME-Einschränkung ersetzt keine vollständige Untersuchung des Dateiinhalts. Siehe [Supabase-Uploadgrenzen](https://supabase.com/docs/guides/storage/uploads/file-limits).

Für einen anschließenden Funktionstest kann ein kleines JPEG/PNG/WebP direkt im Storage-Dashboard in einen separaten Testordner hochgeladen werden. Ein echtes GIF und eine Datei über 10 MB müssen abgelehnt werden. Nur selbst angelegte Testdateien anschließend über das Storage-Dashboard entfernen. Diesen Test haben wir noch nicht ausgeführt; die noch fehlenden Datenbankbestandteile der Adminoberfläche sind davon unabhängig.
