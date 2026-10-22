
# Edit Immobilien – Übergabe

Die Website zeigt Immobilien und Referenzen. Unter `/admin` können angemeldete Personen Immobilien anlegen, bearbeiten und löschen. Inhalte und Bilder liegen bei Supabase. Kontakt- und Exposé-Anfragen werden über Cloudflare Pages Functions mit Resend an das Büro gemailt.

## Schnell zurechtfinden

In VS Code öffnet **Strg+Shift+F** die projektweite Textsuche. Nach `ÜBERGABE` suchen, um alle Übergabekommentare zu finden. Mit einer Kennung wie `ADMIN-02` lässt sich ein bestimmter Befund finden. Die Kommentare erklären Problem, Auswirkung und nächsten Schritt direkt an der betreffenden Stelle.

| Gesucht | Datei / Ordner |
| --- | --- |
| Anmeldung und Zugang zum Adminbereich | `src/admin/LoginPage.tsx`, `src/admin/AdminApp.tsx` |
| Immobilienübersicht und Löschen | `src/admin/PropertiesPage.tsx` |
| Immobilie bearbeiten, Bilder und Reihenfolge | `src/admin/PropertyFormPage.tsx` |
| Sichtbare Plätze wählen und Immobilien verschieben | [Positionierung im Adminbereich](docs/POSITIONIERUNG.md), `src/admin/PropertyPositionPicker.tsx` |
| Verhalten beim Speichern und bei Uploadfehlern | [Upload-Absicherung](docs/SPEICHERN_UND_UPLOADS.md) – lokal geprüft, Veröffentlichung steht aus |
| Verbindung zu Datenbank und Bildspeicher | `src/lib/supabase.ts` |
| Öffentliche Immobilienliste und Ersatzdaten bei Ausfall | `src/components/PropertiesSection.tsx`, `src/hooks/useProperties.ts` |
| Kontaktformular / Exposé-Anfrage | `src/components/ContactSection.tsx`, `src/components/ExposeRequestDialog.tsx` |
| Mailversand auf dem Server | `functions/api/contact.ts`, `functions/api/expose-request.ts` |
| Spamschutz und benötigte Cloudflare-Einstellungen | [Turnstile einrichten](docs/TURNSTILE_EINRICHTUNG.md) – Kontaktformular nach Ladefix erfolgreich abgesendet; tatsächlicher Maileingang und Exposé-Live-Test unbestätigt |
| Texte und Seitenabschnitte | `src/components/`, Zusammensetzung in `src/App.tsx` |
| Impressum und Datenschutz | `src/components/Impressum.tsx`, `src/components/Datenschutz.tsx` |
| Datenbankänderungen | `supabase/migrations/` |
| Objektnummern, Sortierfunktion und bestätigte Funktionstests | [Einrichtung und Testergebnisse](supabase/setup/ADMIN_VORAUSSETZUNGEN.md) – in Supabase angewendet, per Nutzerbericht bestätigt |
| Bestehende Supabase-Regeln und Uploadgrenzen prüfen (nur lesend) | [Anleitung Schritt 4](supabase/diagnostics/ANLEITUNG.md), [SQL-Abfrage](supabase/diagnostics/sicherheitspruefung.sql) |
| Uploadgrenzen direkt in Supabase einstellen | [Anleitung und Kontrollabfrage](supabase/setup/BILDUPLOAD_GRENZEN.md) – Formate und 10 MiB serverseitig per Nutzerbericht bestätigt |
| Weiterleitungen alter Webadressen | `public/_redirects` |

## Wichtige offene Punkte

Stand: 22.10.2026. Dies ist eine Prüfung des vorhandenen Quellcodes, keine vollständige Sicherheitsfreigabe. **SICHERHEIT-04 und ADMIN-02 sind im Quellcode behoben; die übrigen Befunde sind offen.** Wirksam auf der Website werden die Änderungen erst nach Veröffentlichung. „PRÜFEN“ bedeutet: Die tatsächliche Einstellung im externen Dienst ist aus dem Repository nicht feststellbar.

| Suchkennung | Befund und Handlungsbedarf |
| --- | --- |
| `SICHERHEIT-01` | **Hoch, teilweise begrenzt:** Die öffentliche Selbstregistrierung wurde laut Nutzer in Supabase deaktiviert. Bestehende Konten behalten ihre bisherigen Rechte. Die Adminansicht unterscheidet weiterhin nur angemeldet/nicht angemeldet; eine Freigabe bestimmter Admin-Konten bleibt offen. |
| `SICHERHEIT-02` | **Hoch, prüfen:** Regeln für Datenbank und Bildspeicher fehlen im Repository, ebenso das ursprüngliche Tabellenschema. Supabase-Regeln exportieren und prüfen: Gäste lesen nur öffentliche Inhalte; nur Admins ändern sie. Öffentliche Abfragen liefern sämtliche Spalten einschließlich der vermeintlich internen Objektnummer. |
| `SICHERHEIT-03` | **Teilweise behoben:** Kontakt- und Exposé-Formular verlangen einen serverseitig geprüften Turnstile-Nachweis für die konfigurierte Domain und Formularaktion. Ohne erfolgreiche Prüfung wird keine Mail gesendet. Cloudflare-Einrichtung, Turnstile-Prüfung und erfolgreiches Absenden des Kontaktformulars nach Ladefix wurden vom Nutzer bestätigt; tatsächlicher Maileingang ist mangels Postfachzugriff unbestätigt. Exposé-Live-Test und zusätzliches Mengenlimit bleiben offen. [Einrichtung und Fehlerbehebung](docs/TURNSTILE_EINRICHTUNG.md). |
| `SICHERHEIT-04` | **Im Code behoben:** Beide Mail-Endpunkte prüfen JSON-Struktur, Texttypen und Feldlängen vor der Verarbeitung. Maximal 64 KiB werden eingelesen, auch ohne verlässliche Längenangabe. Ungültige Anfragen erhalten 400, zu große 413, falsche Inhaltstypen 415. |
| `SICHERHEIT-05` | **Teilweise behoben:** Im Adminbereich nur JPEG, PNG und WebP, maximal 10 MB pro Datei (10.000.000 Byte) und 20 Bilder insgesamt. Auswahl, Drag & Drop und Speichern prüfen die Grenzen; der Uploadhelfer prüft Formatangabe und Größe zusätzlich. Die Nutzer-Kontrollabfrage bestätigt dieselben Formate und 10 MiB (10.485.760 Byte) im Bucket; die Website ist etwas strenger. Ein erlaubter Bild-Upload wurde vom Nutzer erfolgreich getestet. [Einrichtung und Kontrolle](supabase/setup/BILDUPLOAD_GRENZEN.md). Die Ablehnung unzulässiger Uploads im Live-System und die serverseitige Begrenzung der Gesamtzahl bleiben offen. Die Browserprüfung beweist nicht den tatsächlichen Dateiinhalt. |
| `ADMIN-01` | **Im Code abgesichert, SQL-Einrichtung und Kontrollwerte per Nutzerbericht bestätigt:** Reihenfolge und Datensatz werden gemeinsam gespeichert; bei Ablehnung wird beides zurückgenommen. Neue Bilddateien werden bei eindeutigen Fehlern zur Bereinigung angefordert. Bei unklarem Ergebnis bleiben Bilder erhalten und erneutes Speichern wird gesperrt. Veröffentlichung und Live-Test sind noch nicht bestätigt. [Einrichtung 0004](supabase/setup/ATOMARES_SPEICHERN.md), [Details und Grenzen](docs/SPEICHERN_UND_UPLOADS.md); dauerhafte Restdatei-Bereinigung bleibt offen. |
| `ADMIN-02` | **Im Code behoben:** Alte Bilder werden erst nach bestätigter Speicherung gelöscht. Bei Löschfehlern bleibt die Immobilie gespeichert; die Adminübersicht weist auf die nötige Bereinigung des Bildspeichers hin. |
| `ADMIN-03` | Zwei Personen können Änderungen gegenseitig überschreiben. Abgleich des Bearbeitungsstands ergänzen. |
| `ADMIN-04` | **Hoch:** Löschen ist endgültig; Bilder bleiben im öffentlichen Speicher. Wiederherstellung, Sicherung und Bildbereinigung klären. |
| `ADMIN-05` | Bei Datenbankausfall können unbegrenzt alte Angebote ohne Hinweis erscheinen. Ersatzdaten zeitlich begrenzen und kennzeichnen. |
| `BETRIEB-01` | `VITE_`-Werte sind öffentlich. Dort niemals geheime Server-Schlüssel hinterlegen. Der öffentliche Supabase-Schlüssel ersetzt keine Zugriffsregeln. |
| `BETRIEB-02` | **Hoch:** Anfragen werden nicht dauerhaft zwischengespeichert und bei Versandfehlern nicht automatisch erneut versendet. Ablage und Fehlerüberwachung fehlen. |
| `BETRIEB-03` | Exposés werden nicht automatisch an Interessenten geschickt. Das Büro muss die Anfragen bearbeiten. `src/FLOWFACT_INTEGRATION.md` enthält historische Entwürfe, keine fertige Integration. |

## Bedienung des Adminbereichs

1. `/admin` öffnen und mit einem bestehenden Supabase-Konto anmelden. Kontoanlage, Passwortwiederherstellung und Zwei-Faktor-Anmeldung bietet diese Oberfläche nicht an; deren Verwaltung muss bei der Übergabe geklärt werden.
2. Über **Neue Immobilie** ein Angebot anlegen oder bei einem bestehenden Eintrag **Bearbeiten** wählen.
3. Titel, PLZ, Ort, Preis, Kategorie und Bilder pflegen. Der Ort wird anhand der PLZ vorgeschlagen und kann korrigiert werden.
   Bilder: JPEG, PNG oder WebP, höchstens 10 MB pro Datei und insgesamt 20 Bilder einschließlich vorhandener Bilder. Bei gemischter Auswahl werden passende Dateien übernommen; abgelehnte Dateien erscheinen mit Begründung. Bei älteren Objekten mit mehr als 20 Bildern vor dem Speichern die Anzahl reduzieren.
4. „Aktiv“ erscheint bei aktuellen Angeboten, „Verkauft“/„Vermietet“ bei Referenzen. Es gibt keinen Entwurfsstatus: Gespeicherte Inhalte können unmittelbar öffentlich erscheinen.
5. Die Reihenfolge bestimmt die Position in der Liste. Die Objektnummer wie `EI-005` wird automatisch vergeben.
6. Speichern und anschließend die öffentliche Seite kontrollieren. Wegen der dokumentierten Fehler möglichst nicht gleichzeitig dasselbe Objekt bearbeiten. Löschen lässt sich in der Oberfläche nicht rückgängig machen.

## Betrieb und Zugänge übergeben

Der neue Verantwortliche benötigt Zugriff auf Repository, Domain/DNS, Cloudflare Pages, Supabase und Resend. Kontoinhaber, Abrechnung, Wiederherstellung und verantwortliches Postfach gemeinsam festhalten; Passwörter über einen Passwortmanager übergeben.

- **Supabase:** Tabelle `properties`, Bildspeicher `property-images`, Benutzerkonten und Zugriffsregeln. Die SQL-Dateien ergänzen eine bestehende Datenbank; sie richten kein vollständiges neues System ein. Für fehlende Objektnummern und Sortierfunktion die [aktuelle Anleitung zu 0003](supabase/setup/ADMIN_VORAUSSETZUNGEN.md) verwenden. Datenbank und Bilder sichern und eine Wiederherstellung erproben.
- **Cloudflare Pages:** Build-Befehl `npm run build`, Ausgabeordner `build`. Die Funktionen aus `functions/` müssen ebenfalls bereitgestellt werden; reines Hochladen der statischen Dateien reicht für Formulare nicht aus.
- **Öffentliche Build-Einstellungen:** `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. `.env.production` ist versioniert; sie enthält nach den vorhandenen Variablennamen öffentliche Verbindungsdaten. Bestehende lokale Änderungen daran wurden bei dieser Dokumentation nicht verändert.
- **Nur auf dem Server:** `RESEND_API_KEY`; optional `CONTACT_EMAIL` und `RESEND_FROM`. Standardempfänger ist `kontakt@edit-immobilien.de`. Absenderfreigabe und tatsächlichen Posteingang prüfen. Keine geheimen Werte in Git oder in `VITE_`-Variablen speichern.
- **Spamschutz vor Veröffentlichung konfigurieren:** öffentlich `VITE_TURNSTILE_SITE_KEY`, nur auf dem Server `TURNSTILE_SECRET_KEY` und `TURNSTILE_ALLOWED_HOSTNAMES`. Ohne gültige Konfiguration sperrt die neue Codeversion den Formularversand. Siehe [Einrichtungsanleitung](docs/TURNSTILE_EINRICHTUNG.md).
- **Kontrolle nach Veröffentlichung:** Anmeldung, öffentliche Angebote, Bilder sowie Kontakt- und Exposé-Anfrage mit eigenen Testdaten prüfen. Auch den Eingang im Büro kontrollieren; eine Erfolgsmeldung beweist keine Zustellung ins Postfach.
- **Überwachung:** Fehler von Cloudflare/Resend und Supabase-Verfügbarkeit prüfen. `.github/workflows/keepalive.yml` führt nur einen regelmäßigen Datenbank-Leseaufruf aus und benötigt GitHub-Secrets; er ersetzt weder Ausfallüberwachung noch Sicherungen.

## Lokal starten – für die technische Betreuung

Node.js mit npm installieren und im Projektordner ausführen:

```sh
npm ci
npm run dev
```

Die Entwicklungsseite öffnet sich normalerweise unter `http://localhost:3000`. Öffentliche Supabase-Einstellungen in `.env.local` hinterlegen. `npm run dev` startet nur Vite und stellt die Cloudflare-Mailfunktionen nicht bereit. Für vollständige Formulartests eine passende Cloudflare-Testumgebung verwenden.

```sh
npm run build
```

Erstellt die veröffentlichbaren Website-Dateien in `build/`. Der Build ersetzt keine Prüfung der externen Zugriffsregeln und Mailfunktionen.

`npm run test:forms` prüft beide Mail-Endpunkte mit gültigen und manipulierten Anfragen, Größenlimits und Übertragungsfehlern. Der Maildienst wird simuliert; es werden keine E-Mails versendet. Für diese Tests Node.js ab Version 22.18 verwenden.

`npm run test:property-save` prüft die Reihenfolge von Speicherung und Bildlöschung sowie Datenbank- und Löschfehler. Datenbank und Bildspeicher werden simuliert; echte Immobilien und Bilder werden nicht verändert. Ebenfalls Node.js ab Version 22.18 verwenden.

`npm run test:image-upload` prüft Formate, Dateigrößen und die gemeinsame Anzahl vorhandener und neuer Bilder, auch bei gemischter oder wiederholter Auswahl. Keine echten Uploads; ebenfalls Node.js ab Version 22.18 verwenden.

`npm run seed:properties` fügt **Beispielimmobilien direkt in die konfigurierte Datenbank** ein. Nur mit einer bewusst gewählten Testdatenbank verwenden. Ein dafür eingesetzter `SUPABASE_SERVICE_ROLE_KEY` gehört ausschließlich in die lokale Serverumgebung und niemals in die Website.

## Fachliche Quellen zur Sicherheitsprüfung

Die Bewertung der externen Zugriffskontrolle stützt sich auf die offiziellen Dokumentationen zu [Supabase-Datenbankregeln](https://supabase.com/docs/guides/database/postgres/row-level-security) und [Supabase-Bildspeicherregeln](https://supabase.com/docs/guides/storage/security/access-control). Die Sichtbarkeit der Build-Variablen beschreibt die [Vite-Dokumentation](https://v6.vite.dev/guide/env-and-mode).
