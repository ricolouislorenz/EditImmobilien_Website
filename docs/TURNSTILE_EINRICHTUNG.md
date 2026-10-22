# Spamschutz für Kontakt- und Exposé-Anfragen

ÜBERGABE SICHERHEIT-03: Die Integration ist im Code vorbereitet und lokal getestet, noch nicht veröffentlicht oder im Cloudflare-Konto eingerichtet. Ein separates Mengenlimit bleibt offen. Turnstile reduziert automatisierten Missbrauch, garantiert aber keine vollständige Spamverhinderung.

## Was außerhalb von VS Code nötig ist

Es sind ein Turnstile-Widget und drei Variablen im bestehenden Cloudflare-Pages-Projekt erforderlich. Supabase muss dafür nicht geändert werden. Die bisherigen Variablen für Resend, Empfänger und Supabase bleiben bestehen.

### 1. Widget anlegen

1. Im Cloudflare-Konto **Turnstile → Add widget** öffnen.
2. Name: zum Beispiel **Edit Immobilien – Formulare**.
3. Als erlaubte Hostnamen `edit-immobilien.de` und `www.edit-immobilien.de` eintragen. Keine URL mit `https://`, keine Pfade und keine Platzhalter verwenden.
4. Widget-Modus **Managed** wählen. Pre-clearance ist für diese Integration nicht erforderlich.
5. Widget erstellen. Cloudflare zeigt einen **Site Key** und einen **Secret Key**.

Der Site Key ist öffentlich. Den Secret Key nur im vorgesehenen Secret-Feld von Cloudflare speichern und über einen Passwortmanager übergeben; nicht in Git, in `VITE_`-Variablen oder hier im Chat hinterlegen.

### 2. Variablen im Website-Projekt setzen

Unter **Workers & Pages → Website-Projekt → Settings → Variables and Secrets** die **Produktionsumgebung** auswählen und ergänzen:

| Name | Wert | Art |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Site Key des Widgets | Öffentliche Variable, muss beim Build verfügbar sein |
| `TURNSTILE_SECRET_KEY` | Secret Key desselben Widgets | Secret / verschlüsselt, nur für die Serverfunktionen |
| `TURNSTILE_ALLOWED_HOSTNAMES` | `edit-immobilien.de,www.edit-immobilien.de` | Normale Variable für die Serverfunktionen |

Falls die Website weitere tatsächlich genutzte Hostnamen besitzt, diese sowohl im Widget als auch in `TURNSTILE_ALLOWED_HOSTNAMES` ergänzen. Die Liste wird unabhängig von Browserangaben geprüft; URLs und Platzhalter funktionieren hier nicht.

Für Preview-Deployments gelten eigene Einstellungen. Nur ausdrücklich verwendete Preview-Hostnamen zulassen und die Variablen auch für diese Umgebung setzen. Kein Wildcard-Zugriff auf beliebige Domains. Die öffentlich dokumentierten Cloudflare-Dummy-Secrets werden vom Server absichtlich abgelehnt; Produktions-Builds lehnen auch bekannte Dummy-Site-Keys ab.

### 3. Gemeinsam veröffentlichen

Die Variablen **vor der Veröffentlichung** eintragen. Danach den geänderten Website-Code einschließlich `functions/` und `server/` neu bauen und bereitstellen. Nur „Retry deployment“ eines alten Code-Stands veröffentlicht die lokalen Änderungen nicht. Ein bereits gebautes Frontend erhält einen neu gesetzten `VITE_`-Wert erst durch einen neuen Build.

Voraussetzungen für den bestehenden Build bleiben `npm run build` und Ausgabeordner `build/`. Bei Git-Anbindung muss der geänderte Code zuerst im angebundenen Repository verfügbar sein. Die Veröffentlichung ist ein eigener, noch abzustimmender Schritt.

**Ohne vollständige Konfiguration lässt diese Codeversion keine Formularmails zu.** Sie zeigt stattdessen einen Hinweis. Die Sicherheitsprüfung wird weder bei fehlendem Key noch bei einem Cloudflare-Ausfall umgangen. Domain, Formularaktion und erfolgreicher Nachweis werden vor Resend geprüft.

## Kontrolle nach Veröffentlichung

1. Auf der öffentlichen Website das Kontaktformular über den E-Mail-Kontaktweg öffnen. Die Prüfung soll erscheinen und danach den Senden-Knopf freigeben.
2. Mit eigenen Testdaten eine eindeutig bezeichnete Nachricht senden und den tatsächlichen Eingang im Büro prüfen.
3. Bei einer aktiven Immobilie den Exposé-Dialog testen und ebenfalls den Eingang prüfen. Dafür keinen öffentlichen Testeintrag ohne Abstimmung anlegen.
4. Nach einem fehlgeschlagenen Versand soll eine neue Sicherheitsprüfung starten; bereits eingegebene Formulardaten bleiben für einen erneuten Versuch erhalten.

Eine Erfolgsmeldung bestätigt weiterhin nur die Annahme der Mail durch Resend. Exposés werden vom Büro manuell versendet. Bei Fehlern keine Schlüssel oder komplette Formularinhalte aus Protokollen weitergeben; Fehlermeldung und Zeitpunkt genügen zunächst.

## Technische Tests

`npm run test:forms` prüft beide Server-Endpunkte mit simulierten Cloudflare- und Resend-Antworten. Enthalten sind gültige Eingaben, fehlende/abgelaufene Nachweise, falsche Domain oder Formularaktion, fehlerhafte Konfiguration, Cloudflare-Ausfall und Zeitüberschreitung. Keine echten E-Mails, keine Live-Anfragen und keine echten Schlüssel.

`tests/turnstile-widget.test.mjs` prüft die React-Komponente in einer Browser-DOM-Simulation: verzögertes Laden, gemeinsames Skript, Ablauf, Wiederholung, Aufräumen und verspätete Rückmeldungen geschlossener Formulare. Zum Wiederholen mit Node.js 24 und PowerShell:

```powershell
$turnstileTestRoot = Join-Path $env:TEMP 'edit-immobilien-turnstile-tests'
npm install --prefix $turnstileTestRoot --no-save --package-lock=false --ignore-scripts --no-audit --no-fund jsdom@26.1.0
$env:TURNSTILE_DOM_TEST_MODULE = Join-Path $turnstileTestRoot 'node_modules/jsdom'
node --test --test-isolation=none tests/turnstile-widget.test.mjs
```

Die Testumgebung wird außerhalb der Projektabhängigkeiten installiert. Ein echter Browsertest mit Cloudflare und der Live-Mailversand sind erst nach Einrichtung und Veröffentlichung möglich.

## Verhalten und Grenzen

Turnstile wird erst beim Öffnen eines Mailformulars geladen. Jeder Versand benötigt einen neuen Nachweis; nach einem Sendeversuch wird die Prüfung erneuert. Nachweise werden nicht dauerhaft gespeichert und nicht an Resend weitergegeben. Der serverseitige Cloudflare-Aufruf übermittelt nur Secret und Nachweis, keine Nachricht oder Kontaktdaten.

Die Datenschutzerklärung enthält einen sachlichen Hinweis auf den Dienst und die technischen Daten. Die verantwortliche Person muss die rechtliche Einordnung und die tatsächlich abgeschlossenen Vertragsbedingungen bei der Übergabe bestätigen; der Code behauptet dafür keine neue Vertragsgrundlage.

Offizielle Grundlagen: [Widget im Dashboard anlegen](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/), [Skriptintegration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [serverseitige Prüfung](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) und [Turnstile-Datenschutzhinweise](https://www.cloudflare.com/turnstile-privacy-policy/).
