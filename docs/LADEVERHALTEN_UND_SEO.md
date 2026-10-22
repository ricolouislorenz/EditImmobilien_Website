# Ladeverhalten und Metadaten

ÜBERGABE LADEVERHALTEN / SEO: Im Code umgesetzt und lokal geprüft. Veröffentlichung und Live-Prüfung stehen noch aus.

## Wann wird was geladen?

- **Titelbild:** Wird weiterhin früh und mit hoher Priorität geladen. Die vorhandenen responsiven WebP-Varianten bleiben erhalten.
- **Immobilienkarten:** Bilder verwenden jetzt `loading="lazy"` und asynchrones Dekodieren. Der Browser entscheidet anhand der Nähe zum sichtbaren Bereich, wann er lädt. Die vorhandene feste Bildfläche verhindert, dass die Karten beim Nachladen ihre Höhe ändern.
- **Ratgeber:** Die Texte, Karten und das Formular bleiben wie bisher früh verfügbar. Die PDF-Generatoren und jsPDF werden erst nach einer gültigen Download-Anforderung importiert. Vorher werden sie weder zum Anzeigen der Karten noch zum bloßen Öffnen des Formulars benötigt.
- **Admin und Turnstile:** Die vorhandene Trennung bleibt erhalten; diese Funktionen wurden in diesem Schritt nicht umgebaut.

Im lokalen Produktionsbuild sank der Ratgeber-Oberflächencode von rund **427 kB auf 7,3 kB** vor Komprimierung. Die PDF-Bibliothek wird später separat geladen. Das sind Buildgrößen, keine gemessenen Ladezeiten auf einem echten Mobilgerät. Große Originalfotos können weiterhin relevant sein; automatisch erzeugte kleine Immobilien-Vorschaubilder sind nicht Teil dieses Schritts.

## Downloads bei langsamer Verbindung oder Fehlern

Während der PDF-Erzeugung ist mehrfaches Absenden gesperrt. Schlägt das Laden oder Erstellen fehl, bleiben Formular und Eingaben für einen neuen Versuch erhalten. Eine Erfolgsmeldung erscheint erst nach erfolgreichem Generatoraufruf. Die drei bestehenden PDF-Inhalte und Dateinamen bleiben erhalten.

ÜBERGABE BETRIEB-04: Der bisherige Ratgeberablauf enthielt eine simulierte Wartezeit und behauptete einen E-Mail-Versand. Es gibt dort keine entsprechende Serveranbindung. Der Download startet weiterhin direkt im Browser; die falschen Versandbestätigungen und das Protokollieren von Name/E-Mail wurden entfernt. Die bestehende Eingabeabfrage bleibt erhalten. Die bisher ebenfalls nicht angeschlossene Newsletter-Option ist sichtbar als nicht verfügbar gekennzeichnet und deaktiviert. Eine echte Lead-, Mail- oder Newsletter-Anbindung wäre ein eigener Schritt.

Die PDF-Dateien enthalten bislang einen externen Profilbild-Platzhalter. Dessen Verhalten wurde durch das verzögerte Laden nicht geändert. Der lokale PDF-Test ersetzt dieses externe Bild durch ein kleines lokales Testbild und führt keine Netzwerkaufrufe aus.

## SEO-Texte pflegen

**`src/lib/page-metadata.ts`** ist die gemeinsame Quelle für Titel, Beschreibung, Canonical-Adresse und Indexierungsangaben. Sie enthält getrennte Einträge für Startseite, Impressum, Datenschutz und Adminbereich.

- Bei Navigation im Browser setzt `src/components/SEOHead.tsx` die Werte passend zur Route und stellt bei Rückkehr zur Startseite auch deren Werte wieder her.
- Beim Produktionsbuild schreibt `scripts/page-metadata.mjs`, eingebunden über `vite.config.ts`, die Metadaten in `index.html`, `impressum.html`, `datenschutz.html` und `admin.html` im Ausgabeordner. Dadurch stimmen sie auch beim direkten Aufruf ohne vorherige JavaScript-Ausführung.
- Cloudflare Pages liefert die erzeugten HTML-Dateien automatisch unter `/impressum`, `/datenschutz` und `/admin` aus. `public/_redirects` behält die alten WordPress-Weiterleitungen und verweist Admin-Unterpfade auf die Admin-Datei. Die bisherige globale Proxy-Regel wurde durch Pages' eingebauten SPA-Fallback ohne `404.html` ersetzt, damit statische HTML-, JS- und Bilddateien erreichbar bleiben. Die React-Routen bleiben unverändert.
- Der Adminbereich erhält `noindex, nofollow` in den Metadaten und über `public/_headers`. Das ist eine Indexierungseinstellung, keine Zugriffskontrolle; Anmeldung und Datenbankrechte bleiben dafür zuständig.
- Vorhandene Open-Graph- und Twitter-Vorschaubilder bleiben erhalten. Titel und Beschreibungen folgen jetzt der jeweiligen Seite.
- Die bisherigen Firmenangaben im JSON-LD bleiben erhalten; der `WebPage`-Eintrag wird an die jeweilige öffentliche Seite angepasst. Nicht bestätigte Öffnungszeiten, Koordinaten und sonstige Unternehmensangaben müssen vom Betreiber geprüft werden.
- Die ungenutzten Meta-Angaben `keywords` und `revisit-after` wurden entfernt. Ein neuer Build ist nach Änderungen an den zentralen Metadaten erforderlich.

Die React-Seiteninhalte selbst werden weiterhin im Browser gerendert. Es wurde kein vollständiges serverseitiges Rendering eingeführt und es wurden keine eigenen öffentlichen Immobilien-Detail-URLs ergänzt.

## Prüfen

```powershell
node --test --test-isolation=none tests/seo-metadata.test.mjs tests/pdf-downloads.test.mjs
$env:TURNSTILE_DOM_TEST_MODULE = Join-Path $env:TEMP 'edit-immobilien-turnstile-tests/node_modules/jsdom'
node --test --test-isolation=none tests/loading-seo-ui.test.mjs
npm run build
```

Für die DOM-Testumgebung siehe [Turnstile-Testanleitung](TURNSTILE_EINRICHTUNG.md). Die Tests prüfen getrenntes Laden, echte lokale PDF-Erzeugung ohne Dateidownload, Fehler und Wiederholung im Formular, Schutz vor Doppelabsenden sowie statische und beim Navigieren gesetzte Metadaten.

Nach Veröffentlichung direkt `/`, `/impressum`, `/datenschutz` und `/admin` öffnen und neu laden. Im Seitenquelltext die jeweils passende Canonical-Adresse prüfen. Danach zur Startseite zurücknavigieren und alle drei Ratgeber herunterladen. In den Entwicklertools sollten die PDF-Chunks erst bei der Download-Anforderung erscheinen. Kontakt- und Exposé-Formular sowie Admin-Anmeldung ebenfalls kurz prüfen, damit die Cloudflare-Routen nach dem Deployment bestätigt sind.

Grundlagen: [Google zu Metadaten](https://developers.google.com/search/docs/crawling-indexing/special-tags), [Google zum verzögerten Laden](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading), [Cloudflare-Seiten und SPA-Fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Cloudflare-Weiterleitungen](https://developers.cloudflare.com/pages/configuration/redirects/).
