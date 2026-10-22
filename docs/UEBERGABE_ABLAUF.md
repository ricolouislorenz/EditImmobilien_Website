# Website an den neuen Betreiber übergeben

Ausgangslage laut Nutzer: GitHub, Cloudflare, Supabase, Resend und Domain liegen in persönlichen Konten. Eine vorübergehende Unterbrechung der Website ist akzeptabel. Die tatsächlichen Übertragungen wurden noch nicht durchgeführt.

Empfehlung: Der neue Betreiber erhält eigene Konten und übernimmt das bestehende Projekt. Datenbank und Bilder bleiben im bisherigen Supabase-Projekt; Website und Serverfunktionen werden im Cloudflare-Zielkonto aus diesem Repository bereitgestellt. Persönliche Konten und deren Passwörter werden nicht übergeben.

## 1. Zielkonten vorbereiten

Der neue Betreiber benötigt selbst kontrollierte Anmeldungen bei GitHub, Cloudflare, Supabase und Resend. Bestehende Firmenkonten können verwendet werden. Er verwaltet Wiederherstellung, Zwei-Faktor-Anmeldung und Abrechnung selbst. Eine verantwortliche Person und deren Kontaktadresse festhalten.

In Supabase eine Organisation des Betreibers vorbereiten und den bisherigen Verantwortlichen vorübergehend als Mitglied einladen, damit die Übertragung möglich ist. Das GitHub-Zielkonto beziehungsweise die Zielorganisation ebenfalls festlegen. Die Domainregistrierung getrennt vom Cloudflare-DNS prüfen: Welcher Registrar führt die Domain, wer ist als Inhaber eingetragen und wer bezahlt die Verlängerung?

Noch keine persönlichen Zugänge entfernen oder alte Projekte löschen. Die Bildbereinigung erst im Ziel-Repository einrichten und aktivieren.

## 2. Aktuellen Stand sichern

- Letzte autorisierte Codeänderungen prüfen, committen und pushen; den verwendeten Commit festhalten.
- Datenbank einschließlich Schema, Regeln und Funktionen exportieren. Dateien des Buckets `property-images` getrennt sichern; ein Datenbankexport enthält nicht automatisch die Bilddateien.
- DNS-Einträge exportieren, insbesondere Einträge für das bestehende Postfach. Website-DNS und Mail-DNS unterscheiden.
- Cloudflare-Build-Einstellungen, Variablennamen, Domainzuordnungen und Turnstile-Einstellungen erfassen. Geheime Werte nur über einen Passwortmanager übertragen.
- Letzten funktionierenden Stand behalten, bis die neue Umgebung geprüft ist.

## 3. GitHub und Supabase übertragen

Das Repository an den festgelegten Betreiber übertragen. Laut [GitHub-Dokumentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository) bleiben Repository-Secrets und Webhooks grundsätzlich erhalten. Trotzdem GitHub Actions, Berechtigungen und neue Cloudflare-Verbindung im Zielkonto prüfen. Persönliche Verbindungen nicht als dauerhafte Betriebsgrundlage verwenden.

Das **vorhandene Supabase-Projekt** in die Organisation des Betreibers übertragen. Eine neue leere Datenbank mit erneutem Import ist für diesen Weg nicht erforderlich. Voraussetzungen und Tarifunterschiede vorab prüfen; Supabase nennt unter anderem Eigentümerrechte in der bisherigen Organisation, Mitgliedschaft im Ziel und keine aktive Supabase-GitHub-Integration. Siehe [Project Transfers](https://supabase.com/docs/guides/platform/project-transfer).

Nach der Übertragung prüfen: richtiges Projekt, Immobilien, Bilder, Benutzer, Datenbankfunktionen und Zugriffsregeln. Die SQL-Dateien dieses Repositorys sind Ergänzungen zum bestehenden System, keine vollständige Einrichtung einer leeren Datenbank.

## 4. Cloudflare und Mailversand im Ziel einrichten

Nach der GitHub-Übertragung im Cloudflare-Konto des Betreibers ein neues **Pages-Projekt mit Git-Anbindung** erstellen. Cloudflare weist bei übertragenen Repositorys auf die nötige Neuanlage des Pages-Projekts hin: [Troubleshooting builds](https://developers.cloudflare.com/pages/configuration/git-integration/troubleshooting/).

- Build-Befehl: `npm run build`
- Ausgabeordner: `build`
- Die Serverfunktionen aus `functions/` mit bereitstellen; ein reiner Upload statischer Dateien reicht nicht für Kontakt- und Exposé-Anfragen.
- Öffentliche Werte: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`.
- Serverwerte: `RESEND_API_KEY`, `CONTACT_EMAIL`, gegebenenfalls `RESEND_FROM`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES`.

Turnstile im Zielkonto einrichten und die zulässigen Hostnamen hinterlegen. Für einen Test auf einer neuen Pages-Adresse deren konkreten Hostnamen ebenfalls ausdrücklich konfigurieren; vor dem Produktionsstart die endgültigen Domains prüfen. Siehe [Turnstile-Anleitung](TURNSTILE_EINRICHTUNG.md).

Resend im Team des Betreibers einrichten, die Versanddomain übernehmen beziehungsweise verifizieren und einen passenden neuen Versand-Schlüssel in Cloudflare hinterlegen. Die [Domain-Claim-Funktion](https://resend.com/changelog/domain-claim) unterstützt den Wechsel zwischen Teams; bei kürzlich genutzten Domains kann die Freigabe durch den Support nötig sein. Den tatsächlichen Eingang von Kontakt- und Exposé-Anfragen muss eine Person mit Postfachzugriff bestätigen.

## 5. Domain umstellen und prüfen

Domaininhaber, Registrar-Verwaltung und Cloudflare-DNS müssen schließlich vom Betreiber kontrolliert werden. Das konkrete Vorgehen hängt vom Registrar und der bestehenden DNS-Verwaltung ab. Erst dann die Domain mit dem neuen Pages-Projekt verbinden beziehungsweise DNS umstellen. Bestehende Einträge für das Büro-Postfach beibehalten und erforderliche Versand-Verifizierungen gezielt ergänzen.

Prüfen und mit Datum dokumentieren:

- Website unter Hauptdomain und `www`, einschließlich HTTPS.
- Admin-Anmeldung sowie Anlegen, Bearbeiten, Positionieren und Bildanzeige einer Testimmobilie.
- Papierkorb und Wiederherstellung mit Bild und unveränderter Objektnummer.
- Abmeldung nach Inaktivität und nach neuer Anmeldung desselben Kontos in einem zweiten Browser.
- Kontakt- und Exposé-Anfrage einschließlich bestätigtem Eingang im richtigen Büro-Postfach.
- Bereinigung im Ziel-Repository zunächst als reine Vorschau. Erst nach Prüfung aktivieren: [Papierkorb und Bildbereinigung](PAPIERKORB_UND_BILDBEREINIGUNG.md).

Für einen eigenen Website-Adminzugang des Betreibers sorgen. Ein Supabase-Dashboard-Konto und ein Benutzer des Website-Adminbereichs sind unterschiedliche Zugänge.

## 6. Übergabe abschließen

Erst nach erfolgreicher Abnahme:

- Betreiber kontrolliert alle benötigten Konten, Abrechnung, Domainverlängerung und Wiederherstellung.
- Betriebs-Secrets im Ziel prüfen und bekannte persönliche Tokens beziehungsweise überholte Schlüssel kontrolliert ersetzen. Änderungen an Supabase-Schlüsseln mit allen Verwendungsstellen abstimmen, damit Website und Hintergrundläufe weiter funktionieren.
- Bisherigen Verantwortlichen aus Repository, Plattformorganisationen und Website-Adminzugängen entfernen. Der neue Betreiber bestätigt seinen eigenständigen Zugriff.
- Alte Cloudflare-Projekte und nicht mehr benötigte Verbindungen nach bestätigter Umschaltung entfernen; das übertragene Supabase-Projekt weiterverwenden.
- Übergabeprotokoll mit Kontozuordnungen, URLs, Commit, Sicherungsort, offenen Punkten und bestätigten Tests hinterlegen. Keine Passwörter oder geheimen Schlüssel in Git speichern.

Offene Punkte aus der Sicherheitsprüfung bleiben nachvollziehbar dokumentiert: insbesondere ausdrückliche Admin-Freigaben, Konfliktschutz bei gleichzeitiger Bearbeitung, unabhängige Sicherungen und Absicherung der Formularzustellung. Eine technische Übergabe allein behebt diese Punkte nicht.
