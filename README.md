# Edit Immobilien – Bedienung und Übergabe

Die Website zeigt aktuelle Immobilien und Referenzen. Inhalte und Bilder werden unter `/admin` gepflegt. Die Website läuft auf **Cloudflare Pages**, Datenbank, Anmeldung und Bildspeicher auf **Supabase**. Kontakt- und Exposé-Anfragen gehen über **Resend** an das Büro.

Der Wechsel aus den persönlichen Konten in die Konten des neuen Betreibers steht in [Übergabe Schritt für Schritt](docs/UEBERGABE_ABLAUF.md). Die Kontoübertragungen wurden noch nicht bestätigt.

## Schnell zurechtfinden

In VS Code öffnet **Strg + Shift + F** die projektweite Textsuche. Nach **`ÜBERGABE`** suchen, um kurze Erläuterungen im Code zu finden. Kennungen wie `ADMIN-03` führen direkt zu einem bestimmten offenen Punkt.

| Thema | Einstieg |
| --- | --- |
| Website, Texte und Seitenabschnitte | `src/App.tsx`, `src/components/` |
| Anmeldung und automatische Abmeldung | `src/admin/AdminApp.tsx`, [Admin-Sitzungen](docs/ADMIN_SITZUNGEN.md) |
| Papierkorb und Wiederherstellung | `src/admin/PropertiesPage.tsx`, [Papierkorb und Bildbereinigung](docs/PAPIERKORB_UND_BILDBEREINIGUNG.md) |
| Immobilie, Bilder und Position bearbeiten | `src/admin/PropertyFormPage.tsx`, [Positionierung](docs/POSITIONIERUNG.md) |
| Fehler beim Speichern oder Hochladen | [Speichern und Uploads](docs/SPEICHERN_UND_UPLOADS.md) |
| Datenbank und Bildspeicher ansprechen | `src/lib/supabase.ts`, `src/hooks/useProperties.ts` |
| Kontaktformular und Exposé-Anfragen | `functions/api/`, `server/`, [Turnstile einrichten](docs/TURNSTILE_EINRICHTUNG.md) |
| Logo, Teamfotos und Titelbild austauschen | `src/lib/assets.ts`, `assets-source/`, `scripts/optimize-images.cjs` |
| Suchmaschinen und Weiterleitungen | `index.html`, `src/components/SEOHead.tsx`, `public/robots.txt`, `public/sitemap.xml`, `public/_redirects` |
| Ladezeit, Ratgeber-Downloads und Metadaten je Seite | [Ladeverhalten und SEO](docs/LADEVERHALTEN_UND_SEO.md), zentrale Texte in `src/lib/page-metadata.ts` |
| Datenbankeinrichtung und Prüfungen | `supabase/migrations/`, `supabase/setup/`, [Sicherheitskontrolle](supabase/diagnostics/ANLEITUNG.md) |
| Lizenzen und Bildquellen | [Attributions.md](src/Attributions.md) |

## Immobilien pflegen

1. `/admin` öffnen und mit einem bestehenden **Website-Admin-Konto** anmelden. Dieses Konto ist vom Supabase-Dashboard-Zugang getrennt. Kontoanlage, Passwortwiederherstellung und Zwei-Faktor-Anmeldung bietet die Websiteoberfläche nicht an.
2. **Neue Immobilie** oder **Bearbeiten** wählen. Titel, PLZ, Ort, Preis, Kategorie und Bilder eintragen. Der vorgeschlagene Ort kann korrigiert werden.
3. **Aktive Immobilien** erscheinen unter „Aktuell“, abgeschlossene Objekte unter „Referenzen“. Es gibt keinen Entwurfsmodus: Gespeicherte Inhalte können sofort öffentlich sichtbar sein.
4. Bilder: **JPEG, PNG oder WebP**, je höchstens **10 MB**, insgesamt höchstens **20**. Das erste Bild ist das Titelbild.
5. Ganz unten unter **Position auf der Website** den sichtbaren Platz auswählen oder über die Schaltflächen verschieben. Erst **Speichern** übernimmt die Änderung.
6. Die öffentliche Anzeige kontrollieren. Die Objektnummer, etwa `EI-001`, wird automatisch vergeben und bleibt bei Bearbeitungen erhalten.
7. **Löschen** verschiebt den Eintrag für **30 Tage in den Papierkorb**. Unten in der Übersicht lässt er sich wiederherstellen. Dabei erscheint er mit seinen Bildern und derselben Nummer am Ende seines Bereichs.

Nach **28 Minuten ohne Bedienung** erscheint eine Warnung, nach **30 Minuten** wird abgemeldet. Ungespeicherte Änderungen gehen dabei verloren. Eine erneute Anmeldung **desselben Kontos** ersetzt die ältere Sitzung; andere Konten können parallel arbeiten. Bei unklarer Speicherung zuerst den gespeicherten Stand neu laden, statt wiederholt abzusenden.

## Bestätigter Einrichtungsstand

Stand: **22.10.2026**. „Bestätigt“ bedeutet: durch den Nutzer im richtigen Supabase-Projekt ausgeführt und anhand der Kontrollwerte geprüft. Lokale Tests ersetzen keine Live-Abnahme.

| Einrichtung | Stand |
| --- | --- |
| `0003` – automatische Objektnummern und bisherige Sortierschnittstelle | SQL und Kontrollwerte bestätigt; Anlegen, Bearbeiten und Bildanzeige mit einer Testimmobilie bestätigt. [Details](supabase/setup/ADMIN_VORAUSSETZUNGEN.md) |
| `0004` – Reihenfolge und Immobilie gemeinsam speichern (`ADMIN-01`) | SQL und Kontrollwerte bestätigt. [Details](supabase/setup/ATOMARES_SPEICHERN.md) |
| `0005` – Inaktivitätsfrist und neueste Sitzung je Konto | SQL und Kontrollwerte bestätigt. [Details](docs/ADMIN_SITZUNGEN.md) |
| `0006` – Papierkorb und Schutz verwendeter Bilder (`ADMIN-04`) | SQL und Kontrollwerte bestätigt. GitHub-Bereinigung noch nicht eingerichtet oder aktiviert. [Details](docs/PAPIERKORB_UND_BILDBEREINIGUNG.md) |
| Uploadgrenzen im Bucket `property-images` | JPEG/PNG/WebP und **10 MiB** serverseitig bestätigt; die Website ist mit 10 MB etwas strenger. [Details](supabase/setup/BILDUPLOAD_GRENZEN.md) |
| Turnstile und Formularversand | Einrichtung und Absenden des Kontaktformulars bestätigt. Tatsächlicher Maileingang und separater Exposé-Live-Test noch unbestätigt. |

Die Veröffentlichung und Live-Abnahme der neueren Änderungen ist noch nicht vollständig bestätigt. Der tägliche Hintergrundlauf für ungenutzte Bilder bleibt bis zur bewussten Einrichtung deaktiviert. Zuerst eine Vorschau ohne Löschung ausführen; erst nach Prüfung aktivieren.

Die Migrationen ergänzen eine **bestehende Datenbank**. Sie sind kein vollständiger Neuaufbau einer leeren Supabase-Instanz. `0001` und `0002` bleiben als historische Migrationsdateien erhalten; für die beschriebene Einrichtung ab `0003` die jeweilige Anleitung beachten. Bereits eingerichtete Projekte nicht ohne Anlass erneut migrieren.

## Offene Punkte für den neuen Betreiber

| Suchkennung | Was noch fehlt |
| --- | --- |
| `SICHERHEIT-01` | Eine ausdrückliche Freigabe bestimmter Admin-Konten. Öffentliche Registrierung ist laut Nutzer deaktiviert; bestehende Konten behalten grundsätzlich ihre bisherigen Rechte. Sitzungsprüfung ersetzt keine Adminrolle. |
| `SICHERHEIT-02` | Vollständiger Export der ursprünglichen Tabellen- und Storage-Regeln. `0005`/`0006` ergänzen Schutzregeln, bilden aber nicht sämtliche ursprünglichen Rechte ab. Öffentliche Immobilienabfragen liefern auch die Objektnummer. |
| `SICHERHEIT-03` | Zusätzliche Mengenbegrenzung für Formularanfragen sowie bestätigter Maileingang und Exposé-Live-Test. |
| `SICHERHEIT-05` | Serverseitiges Gesamtlimit von 20 Bildern je Immobilie, Prüfung des tatsächlichen Dateiinhalts und Live-Test unzulässiger Uploads. |
| `ADMIN-03` | Konflikthinweis bei gleichzeitigen Änderungen verschiedener Konten. Bis dahin möglichst nicht dasselbe Objekt parallel bearbeiten. |
| `ADMIN-05` | Zeitgrenze und sichtbarer Hinweis für zwischengespeicherte Angebote bei Datenbankausfall. Derzeit kann ein alter Stand unbegrenzt angezeigt werden. |
| `BETRIEB-02` | Dauerhafte Zwischenablage, Wiederholungen und Überwachung bei Fehlern im Mailversand. |
| `BETRIEB-03` | Automatischer Exposé-Versand ist nicht vorhanden. Die Anfrage wird dem Büro gemeldet; das Büro versendet das Exposé manuell. Eine Flowfact-Anbindung ist nicht implementiert. |
| `BETRIEB-04` | Ratgeber werden mit einem Klick als PDF heruntergeladen, ohne Name oder E-Mail-Adresse abzufragen. Eine Mail-/Newsletter-Funktion gehört nicht zu diesen Downloads. |

Bereits im Code abgesichert: Prüfung von Formulargrößen und Feldtypen (`SICHERHEIT-04`), gemeinsames Speichern (`ADMIN-01`), Bestätigung vor dem Entfernen alter Bilder (`ADMIN-02`) sowie Papierkorb und kontrollierte Bereinigung (`ADMIN-04`). Unabhängige Sicherungen und die abschließende Live-Abnahme bleiben erforderlich.

## Betrieb und Zugänge

Der Betreiber benötigt Kontrolle über **GitHub, Cloudflare, Supabase, Resend, Domain/DNS und das empfangende Büro-Postfach**. Wiederherstellung und Abrechnung gehören ebenfalls zur Übergabe. Secrets über einen Passwortmanager übergeben, niemals in Git oder im Chat.

| Cloudflare-Variable | Verwendung |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Öffentliche Verbindung zum bestehenden Supabase-Projekt |
| `VITE_TURNSTILE_SITE_KEY` | Öffentlicher Turnstile-Schlüssel |
| `RESEND_API_KEY` | Geheimes Server-Secret für den Mailversand |
| `CONTACT_EMAIL`, gegebenenfalls `RESEND_FROM` | Empfänger und Absender; Standardempfänger ist `kontakt@edit-immobilien.de` |
| `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES` | Serverseitige Sicherheitsprüfung und erlaubte Domains |

**ÜBERGABE BETRIEB-01:** `VITE_`-Werte sind im Browser sichtbar. Dort ausschließlich öffentliche Werte hinterlegen. `.env.production` enthält öffentliche Verbindungsdaten; geheime Schlüssel gehören dort nicht hinein. Lokale `.env.local`-Dateien sind von Git ausgeschlossen.

Cloudflare Pages baut mit **`npm run build`**, Ausgabeordner **`build`**. Die Cloudflare Functions aus `functions/` müssen mit bereitgestellt werden. Ein Upload nur der statischen Dateien stellt die Mailfunktionen nicht bereit. `public/_redirects` enthält die bisherigen Weiterleitungen und die Admin-Unterpfade. Andere React-Routen nutzen Pages' eingebauten SPA-Fallback ohne `404.html`; ein GitHub-Pages-Deployment ist nicht vorgesehen.

Supabase enthält `properties`, den geschützten Papierkorb `property_trash`, private Sitzungs-/Bereinigungsdaten sowie den öffentlichen Bild-Bucket `property-images`. **Datenbank und tatsächliche Bilddateien getrennt sichern.** Ein Papierkorb ersetzt keine unabhängige Sicherung.

Die GitHub-Workflows liegen unter `.github/workflows/`: Keep-Alive prüft lediglich die Erreichbarkeit; die Bildbereinigung benötigt eine eigene Einrichtung. Beide ersetzen keine vollständige Ausfallüberwachung. [Bereinigung einrichten](docs/PAPIERKORB_UND_BILDBEREINIGUNG.md).

## Lokal arbeiten und prüfen

Für Entwicklung und Tests **Node.js ab 22.18** mit npm verwenden:

```sh
npm ci
npm run dev
```

Die lokale Website öffnet sich normalerweise unter `http://localhost:3000`. Vite startet die Cloudflare-Mailfunktionen nicht; vollständige Versandtests benötigen eine passende Cloudflare-Umgebung.

```sh
npm run build
npm run test:forms
npm run test:property-save
npm run test:image-upload
npm run test:property-uploads
```

Der Build erzeugt `build/` einschließlich der routebezogenen HTML-Metadaten neu. Die genannten Tests simulieren Maildienst, Datenbank und Storage; sie verändern keine echten Immobilien. Weitere Prüfungen für Sitzungen, Papierkorb, Bereinigung sowie [Ladeverhalten und SEO](docs/LADEVERHALTEN_UND_SEO.md) stehen bei den jeweiligen Anleitungen. Die SQL-Tests nutzen eine separat installierte lokale PostgreSQL-Testumgebung, die Oberflächentests eine separate DOM-Testumgebung. Es gibt derzeit keinen eigenen Lint- oder Typecheck-Befehl.

**Statische Fotos austauschen:** Originale in `assets-source/` ablegen, Aufträge in `scripts/optimize-images.cjs` anpassen, **`npm run optimize:images`** ausführen und Pfade/Bildgrößen in `src/lib/assets.ts` pflegen. Originale und responsive Varianten werden deshalb beide benötigt.

**Bereinigte Projektstruktur:** Ungenutzte UI-Bausteine, alte Entwurfstexte, doppelte Suchmaschinen-Dateien, Beispiel-Datenimport und der GitHub-Pages-Hilfsbuild wurden entfernt. Generierte Builds und lokale Logs gehören nicht ins Repository. Tests, Migrationshistorie, Bildoriginale und Lizenzhinweise bleiben Bestandteil der Übergabe.
