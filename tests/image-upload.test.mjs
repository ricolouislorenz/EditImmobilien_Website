import assert from "node:assert/strict";
import { test } from "node:test";
import { getImageValidationError, selectImageFiles, MAX_IMAGE_BYTES } from "../src/lib/image-upload.ts";

// Nur Dateimetadaten; keine echten Uploads oder Änderungen am Bildspeicher.
const jpeg = (name = "haus.jpg", size = 1000) => ({ name, type: "image/jpeg", size });

test("JPEG, PNG und WebP einschließlich großer Dateiendungen werden angenommen", () => {
  for (const [name, type] of [["a.jpg", "image/jpeg"], ["a.JPEG", "image/jpeg"], ["a.PNG", "image/png"], ["a.webp", "image/webp"]]) {
    assert.equal(getImageValidationError({ name, type, size: 1000 }), null);
  }
});

test("Genau 10 MB erlaubt, ein Byte mehr abgelehnt", () => {
  assert.equal(MAX_IMAGE_BYTES, 10_000_000);
  assert.equal(getImageValidationError(jpeg("haus.jpg", MAX_IMAGE_BYTES)), null);
  assert.match(getImageValidationError(jpeg("haus.jpg", MAX_IMAGE_BYTES + 1)), /10 MB/);
});

test("Leere Dateien werden abgelehnt", () => {
  assert.match(getImageValidationError(jpeg("leer.jpg", 0)), /leer/);
});

test("SVG, GIF, HEIC, PDF und fehlende Formatangaben werden abgelehnt", () => {
  for (const [name, type] of [["a.svg", "image/svg+xml"], ["a.gif", "image/gif"], ["a.heic", "image/heic"], ["a.pdf", "application/pdf"], ["a.jpg", ""], ["a.jpg", "constructor"]]) {
    assert.notEqual(getImageValidationError({ name, type, size: 1000 }), null);
  }
});

test("Unpassende Endung und Formatangabe werden abgelehnt", () => {
  for (const [name, type] of [["a.svg", "image/jpeg"], ["a.jpg", "image/png"], ["a.jpg.exe", "image/jpeg"], ["ohne-endung", "image/jpeg"]]) {
    assert.notEqual(getImageValidationError({ name, type, size: 1000 }), null);
  }
});

test("Bei gemischter Auswahl zählen abgelehnte Dateien nicht zum Bilderlimit", () => {
  const good = jpeg();
  const result = selectImageFiles([jpeg("zu-gross.jpg", MAX_IMAGE_BYTES + 1), good], 19);
  assert.deepEqual(result.accepted, [good]);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /zu-gross.jpg.*10 MB/);
});

test("Vorhandene und neue Bilder zählen zusammen; Überhang wird benannt", () => {
  const files = [jpeg("1.jpg"), jpeg("2.jpg"), jpeg("3.jpg")];
  const result = selectImageFiles(files, 18);
  assert.deepEqual(result.accepted, files.slice(0, 2));
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /3.jpg.*20 Bilder/);
});

test("Mehrfache Auswahl kann keinen zusätzlichen Platz schaffen", () => {
  const first = selectImageFiles([jpeg("1.jpg"), jpeg("2.jpg")], 17);
  const second = selectImageFiles([jpeg("3.jpg"), jpeg("4.jpg")], 17 + first.accepted.length);
  assert.equal(first.accepted.length + second.accepted.length, 3);
  assert.equal(second.errors.length, 1);
});

test("Bei 20 oder mehr vorhandenen Bildern wird nichts hinzugefügt", () => {
  for (const count of [20, 21]) {
    const result = selectImageFiles([jpeg()], count);
    assert.deepEqual(result.accepted, []);
    assert.equal(result.errors.length, 1);
  }
});

test("Nach Entfernen eines Bildes ist wieder ein Platz frei", () => {
  const result = selectImageFiles([jpeg()], 19);
  assert.equal(result.accepted.length, 1);
  assert.deepEqual(result.errors, []);
});
