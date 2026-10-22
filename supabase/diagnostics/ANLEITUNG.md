# Supabase-Sicherheitsprüfung – Schritt 4

Die Datei [sicherheitspruefung.sql](sicherheitspruefung.sql) erstellt eine Bestandsaufnahme. Sie ändert keine Daten, Rechte oder Einstellungen. Sie gehört bewusst nicht in den Ordner `migrations` und wird nicht automatisch angewendet.

## Ausführen

1. Im Supabase-Dashboard das Projekt öffnen, das diese Website tatsächlich nutzt. Zum Abgleich steht die Projektadresse als `VITE_SUPABASE_URL` in den Website-Einstellungen. Keine Schlüssel weitergeben.
2. **SQL Editor** öffnen und eine neue Abfrage anlegen.
3. Den gesamten Inhalt von `sicherheitspruefung.sql` einfügen. Im Editor die vorhandene Verwaltungsrolle verwenden, normalerweise `postgres`, damit alle Regeln sichtbar sind.
4. **Run** drücken. Die Abfrage liefert genau eine Ergebniszeile mit der Spalte **bericht**.
5. Den vollständigen Zellinhalt kopieren und hier im Chat einfügen. Alternativ die Ergebniszeile als CSV exportieren und anhängen. Bei einer Fehlermeldung den Fehlertext senden; dann passen wir die Abfrage an.

Der Bericht enthält Tabellenstruktur, Regeln, technische Rollen und Einstellungen. Er liest keine Immobilien-, Kontakt-, Benutzer- oder Dateidatensätze und keine Funktionsquelltexte. In selbst formulierten Regeln oder Standardwerten können trotzdem fest eingetragene E-Mail-Adressen oder andere vertrauliche Werte stehen: Diese gegebenenfalls vor dem Teilen durch `[GESCHWÄRZT]` ersetzen und die übrige Regelstruktur beibehalten.

## Was der Bericht zeigt

| Abschnitt | Bedeutung |
| --- | --- |
| 01 | Existieren die erwartete Immobilientabelle und der Bildspeicher? |
| 02–03 | Tabellen, Views, aktivierte Zugriffskontrolle und Spaltenstruktur; auch Hinweise auf einen älteren KV-Speicher werden sichtbar. |
| 04 | Welche Bedingungen erlauben Lesen, Anlegen, Ändern oder Löschen? Alle Regeln auf `storage.objects` werden benötigt, weil auch allgemeine Regeln unseren Bildspeicher betreffen können. |
| 05–06 | Welche Tabellen- und Spaltenrechte haben Gäste (`anon`), angemeldete Konten (`authenticated`) und der Server (`service_role`)? |
| 07 | Ist der Bildspeicher öffentlich, und welche Größen-/Formatgrenzen sind eingestellt? |
| 08–09 | Welche Datenbankbedingungen und automatischen Abläufe bestehen bereits? |
| 10 | Welche Funktionen im Schema `public` sind aufrufbar, und arbeiten sie mit erhöhten Rechten? Der Quelltext wird nicht ausgelesen. |

Ein Recht mit dem Wert `true` bedeutet allein noch keinen erlaubten Zugriff: Zusätzlich können Datenbankregeln den Zugriff einschränken. Umgekehrt bedeutet ein leerer Regelabschnitt nicht automatisch Sicherheit; bei ausgeschalteter Zugriffskontrolle können Tabellenrechte bereits ausreichen. Der SQL-Editor arbeitet mit Verwaltungsrechten: Ein dort erfolgreicher Zugriff ist kein Test der Website-Berechtigungen.

`null` bei der Dateigröße bedeutet, dass hier kein eigener Bucket-Grenzwert hinterlegt ist; ein globales Storage-Limit kann weiterhin gelten. `null` bei erlaubten Dateitypen bedeutet keine eigene MIME-Einschränkung für diesen Bucket. Ein öffentlicher Bucket ist für öffentliche Immobilienbilder beabsichtigt; Uploads und Löschungen müssen trotzdem geschützt sein.

## Was danach noch geprüft werden muss

Die Abfrage liefert keine vollständige Sicherheitsfreigabe. Auth-Einstellungen, externe Cloudflare-Regeln, das globale Storage-Limit und die Berechtigungsprüfung der eingefügten Edge Function stehen nicht vollständig in diesen Tabellen. Funktionen und Views können weitere Zugriffswege eröffnen; deren konkrete Definitionen prüfen wir bei Bedarf anschließend gezielt.

Nach Auswertung des Berichts bereiten wir die passende Änderung vor und stimmen den nächsten Schritt ab. Dabei müssen wir insbesondere festlegen, welche bestehenden Konten tatsächlich Adminrechte erhalten sollen. Bis dahin wird nichts in Supabase geändert.

Fachliche Grundlagen: [Supabase-Zugriffsregeln](https://supabase.com/docs/guides/database/postgres/row-level-security), [öffentliche und private Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Uploadgrenzen](https://supabase.com/docs/guides/storage/uploads/file-limits) und [PostgreSQL-Regelübersicht](https://www.postgresql.org/docs/current/view-pg-policies.html).
