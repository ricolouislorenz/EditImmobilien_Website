import assert from "node:assert/strict";
import { test } from "node:test";
import { savePropertyWithImageCleanup } from "../src/lib/property-save.ts";

// Nur simulierte Datenbank und Bildspeicher; es werden keine echten Dateien gelöscht.
test("Alte Bilder bleiben erhalten, bis die Speicherung bestätigt ist", async () => {
  const events = [];
  let confirmSave;
  const saved = new Promise((resolve) => { confirmSave = resolve; });
  const result = savePropertyWithImageCleanup({
    save: () => { events.push("save"); return saved; },
    removeImages: async (paths) => {
      events.push("delete");
      assert.deepEqual(paths, ["property/old.jpg"]);
      return { error: null };
    },
  }, ["property/old.jpg"]);
  assert.deepEqual(events, ["save"]);
  confirmSave({ data: { id: "property" }, error: null });
  assert.deepEqual(await result, { imageCleanupFailed: false });
  assert.deepEqual(events, ["save", "delete"]);
});

for (const failure of [
  { name: "Datenbankfehler", save: async () => ({ data: null, error: new Error("Speichern abgelehnt") }) },
  { name: "Verbindungsfehler beim Speichern", save: async () => { throw new Error("Verbindung abgebrochen"); } },
  { name: "Keine bestätigte Zeile, etwa wegen fehlender Rechte oder gelöschtem Objekt", save: async () => ({ data: null, error: null }) },
]) {
  test(`${failure.name}: kein altes Bild wird gelöscht`, async () => {
    let deleted = false;
    await assert.rejects(savePropertyWithImageCleanup({
      save: failure.save,
      removeImages: async () => { deleted = true; return { error: null }; },
    }, ["property/old.jpg"]));
    assert.equal(deleted, false);
  });
}

for (const failure of [
  { name: "Löschfehler im Ergebnis", removeImages: async () => ({ error: new Error("Löschen abgelehnt") }) },
  { name: "Verbindungsfehler beim Löschen", removeImages: async () => { throw new Error("Verbindung abgebrochen"); } },
]) {
  test(`${failure.name}: Speichererfolg bleibt bestehen, Warnung wird zurückgegeben`, async () => {
    let saveCount = 0;
    const result = await savePropertyWithImageCleanup({
      save: async () => { saveCount++; return { data: { id: "property" }, error: null }; },
      removeImages: failure.removeImages,
    }, ["property/old.jpg"]);
    assert.deepEqual(result, { imageCleanupFailed: true });
    assert.equal(saveCount, 1);
  });
}

test("Ohne entfernte Bilder wird der Bildspeicher nicht aufgerufen", async () => {
  const result = await savePropertyWithImageCleanup({
    save: async () => ({ data: { id: "property" }, error: null }),
    removeImages: async () => { assert.fail("Keine Löschung erwartet"); },
  }, []);
  assert.deepEqual(result, { imageCleanupFailed: false });
});
