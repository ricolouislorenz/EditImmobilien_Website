# Immobilien auf der Website positionieren

Im Adminbereich eine Immobilie öffnen und zu **Position auf der Website** gehen.

1. Den gewünschten **Platz ab 1** auswählen. Die Auswahl nennt auch die Immobilie, vor der eingefügt wird.
2. Alternativ **Einen Platz höher/tiefer** oder **Ganz nach oben/unten** verwenden.
3. In der Vorschau die benachbarten Immobilien und die angezeigte Website-Seite prüfen.
4. **Speichern** anklicken. Erst dann wird die neue Reihenfolge übernommen.

Die Position gilt für den gewählten Bereich **Aktuell** oder **Referenzen**. Verkauft, vermietet und verkauft & vermietet gehören gemeinsam zu den Referenzen. Beim Kategorie-Wechsel passt sich die Vorschau an. Besucherfilter und gleichzeitige Änderungen anderer Personen können die tatsächliche Anzeige verändern.

Kann die Reihenfolge nicht geladen werden, **Erneut laden** wählen. Bis dahin bleibt die bisherige Einstellung erhalten.

ÜBERGABE ADMIN-POSITION: Die Oberfläche zeigt sichtbare Plätze statt interner Sortierwerte. Lücken in gespeicherten Werten werden dabei berücksichtigt. Die Speicherung verwendet weiterhin die gemeinsame Datenbankfunktion aus Einrichtung 0004; für diese Oberflächenänderung ist keine neue SQL-Einrichtung nötig.

Lokale Prüfung: `node --test --test-isolation=none tests/property-position.test.mjs`. Die DOM-Prüfungen in `tests/property-form-save.test.mjs` kontrollieren zusätzlich Vorschau, Bereichswechsel und den an die Speicherfunktion übergebenen Wert. Einrichtung der DOM-Testumgebung siehe [Speichern und Uploads](SPEICHERN_UND_UPLOADS.md).
