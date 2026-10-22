import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanupNewUploads, uploadPropertyImages } from "../src/lib/property-uploads.ts";
import { PropertySaveUncertainError, savePropertyWithUploads } from "../src/lib/property-save.ts";

const image = (name = "haus.jpg") => ({ name, type: "image/jpeg", size: 1000 });
const removedResult = (paths) => ({ data: paths.map((name) => ({ name })), error: null });

test("Gleichzeitige Bilder bekommen auch bei identischem Zeitstempel eindeutige Pfade", async (t) => {
  const now = Date.now;
  Date.now = () => 1000;
  t.after(() => { Date.now = now; });
  const paths = await uploadPropertyImages(Array.from({ length: 20 }, () => image("HAUS.JPG")), "property", {
    upload: async () => ({ error: null }), remove: async () => assert.fail("Keine Löschung bei Erfolg"),
  });
  assert.equal(new Set(paths).size, 20);
  for (const path of paths) assert.match(path, /^property\/[0-9a-f-]{36}\.jpg$/);
});

test("Alle Dateien werden vor dem ersten Upload validiert", async () => {
  await assert.rejects(uploadPropertyImages([image(), { ...image("unpassend.svg"), type: "image/svg+xml" }], "property", {
    upload: async () => assert.fail("Keine Teiluploads bei ungültiger Auswahl"),
    remove: async () => assert.fail("Es wurden noch keine Dateien angelegt"),
  }), /JPEG/);
});

test("Teilfehler wartet auch verspätete erfolgreiche Uploads ab und räumt erst danach auf", async () => {
  const paths = [];
  let finishLate;
  let removed = false;
  const late = new Promise((resolve) => { finishLate = resolve; });
  const pending = uploadPropertyImages([image("fehler.jpg"), image("spaet.jpg")], "property", {
    upload: async (path, file) => {
      paths.push(path);
      if (file.name === "fehler.jpg") return { error: new Error("Upload fehlgeschlagen") };
      return late;
    },
    remove: async (requested) => {
      removed = true;
      assert.deepEqual(requested, paths);
      return removedResult(requested);
    },
  });
  await Promise.resolve();
  assert.equal(removed, false);
  finishLate({ error: null });
  await assert.rejects(pending, /Mindestens ein Bild/);
  assert.equal(removed, true);
});

test("Auch Pfade von Uploads mit abgebrochener Antwort werden vor jedem Datensatzversand aufgeräumt", async () => {
  const files = new Set();
  await assert.rejects(uploadPropertyImages([image()], "property", {
    upload: async (path) => { files.add(path); throw new Error("Antwort abgebrochen"); },
    remove: async (paths) => { paths.forEach((path) => files.delete(path)); return removedResult(paths); },
  }), /Mindestens ein Bild/);
  assert.equal(files.size, 0);
});

test("Aufräumen erkennt Löschfehler, Ausnahmen und nicht bestätigte Löschungen", async () => {
  for (const remove of [
    async () => ({ data: null, error: new Error("Keine Rechte") }),
    async () => { throw new Error("Offline"); },
    async () => ({ data: [], error: null }),
  ]) assert.equal(await cleanupNewUploads(["property/new.jpg"], remove), false);
});

test("Teilweise gescheiterte Bereinigung wird nicht als aufgeräumt gemeldet", async () => {
  await assert.rejects(uploadPropertyImages([image("gut.jpg"), image("fehler.jpg")], "property", {
    upload: async (path, file) => ({ error: file.name === "fehler.jpg" ? new Error("Fehler") : null }),
    remove: async () => ({ data: [], error: null }),
  }), /nicht vollständig aufgeräumt/);
});

test("Erneuter Upload nach Teilfehler verwendet neue Pfade und keine alten Dateien", async () => {
  const files = new Set(["property/old.jpg"]);
  const attempted = [];
  let fail = true;
  const ops = {
    upload: async (path) => { attempted.push(path); files.add(path); return { error: fail ? new Error("Fehler") : null }; },
    remove: async (paths) => { paths.forEach((path) => files.delete(path)); return removedResult(paths); },
  };
  await assert.rejects(uploadPropertyImages([image()], "property", ops));
  assert.deepEqual([...files], ["property/old.jpg"]);
  fail = false;
  const success = await uploadPropertyImages([image()], "property", ops);
  assert.notEqual(attempted[0], success[0]);
  assert.deepEqual([...files], ["property/old.jpg", ...success]);
});

test("Abgelehnter gemeinsamer Speicheraufruf löscht nur neue Bilder", async () => {
  await assert.rejects(savePropertyWithUploads({
    upload: async () => ["property/new.jpg"],
    save: async () => ({ data: null, error: { code: "22023" } }),
    removeImages: async (paths) => {
      assert.deepEqual(paths, ["property/new.jpg"]);
      return removedResult(paths);
    },
  }, ["property/old.jpg"]), /Datenbank hat die Speicherung abgelehnt/);
});

for (const code of ["23505", "23502", "22003", "42501", "40001", "40P01", "55P03", "PGRST202"]) {
  test(`Ausdrückliche Datenbank-Ablehnung ${code}: neue Bilder aufräumen, alte behalten`, async () => {
    let deleted = false;
    await assert.rejects(savePropertyWithUploads({
      upload: async () => ["property/new.jpg"],
      save: async () => ({ data: null, error: { code } }),
      removeImages: async (paths) => {
        assert.deepEqual(paths, ["property/new.jpg"]);
        deleted = true;
        return removedResult(paths);
      },
    }, ["property/old.jpg"]), /Datenbank hat die Speicherung abgelehnt/);
    assert.equal(deleted, true);
  });
}

for (const save of [
  async () => { throw new Error("Antwort nach erfolgreicher Speicherung abgebrochen"); },
  async () => ({ data: null, error: null }),
  async () => ({ data: null, error: { code: "UNKNOWN" } }),
]) {
  test("Unbekanntes Speicherergebnis: weder neue noch alte Bilder löschen", async () => {
    await assert.rejects(savePropertyWithUploads({
      upload: async () => ["property/new.jpg"], save,
      removeImages: async () => assert.fail("Bilder könnten bereits im gespeicherten Angebot stehen"),
    }, ["property/old.jpg"]), PropertySaveUncertainError);
  });
}

test("Erfolgreicher Ablauf bewahrt neue Bilder und entfernt alte erst nach Speicherbestätigung", async () => {
  const events = [];
  const result = await savePropertyWithUploads({
    upload: async () => { events.push("upload"); return ["property/new.jpg"]; },
    save: async (paths) => {
      events.push("save"); assert.deepEqual(paths, ["property/new.jpg"]);
      return { data: { id: "property" }, error: null };
    },
    removeImages: async (paths) => {
      events.push("remove-old"); assert.deepEqual(paths, ["property/old.jpg"]);
      return removedResult(paths);
    },
  }, ["property/old.jpg"]);
  assert.deepEqual(events, ["upload", "save", "remove-old"]);
  assert.deepEqual(result, { imageCleanupFailed: false });
});

test("Ohne neue Bilder wird bei abgelehntem Speichern kein Speicher-Löschaufruf ausgelöst", async () => {
  await assert.rejects(savePropertyWithUploads({
    upload: async () => [],
    save: async () => ({ data: null, error: { code: "42501" } }),
    removeImages: async () => assert.fail("Keine neuen Dateien zum Löschen"),
  }, []));
});

test("Bestätigt gespeicherter Datensatz mit unbestätigter alter Bildlöschung bleibt erfolgreich, aber meldet Warnung", async () => {
  const result = await savePropertyWithUploads({
    upload: async () => ["property/new.jpg"],
    save: async () => ({ data: { id: "property" }, error: null }),
    removeImages: async (paths) => {
      assert.deepEqual(paths, ["property/old.jpg"]);
      return { data: [], error: null };
    },
  }, ["property/old.jpg"]);
  assert.deepEqual(result, { imageCleanupFailed: true });
});
