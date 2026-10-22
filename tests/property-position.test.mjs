import assert from "node:assert/strict";
import { test } from "node:test";
import { positionSiblings, visiblePosition, sortOrderForPosition } from "../src/lib/property-position.ts";

const objects = [
  { id: "a", title: "Haus", status: "active", sort_order: 0 },
  { id: "r", title: "Referenz", status: "sold", sort_order: 5 },
  { id: "b", title: "Wohnung", status: "active", sort_order: 20 },
  { id: "c", title: "Grundstück", status: "active", sort_order: 50 },
];

test("Alle sichtbaren Plätze funktionieren beim Anlegen und Bearbeiten trotz Lücken", () => {
  const siblings = positionSiblings(objects, "active");
  for (const existingOrder of [0, 10, 20, 100]) {
    for (let target = 1; target <= siblings.length + 1; target++) {
      const sortOrder = target === visiblePosition(siblings, existingOrder)
        ? existingOrder : sortOrderForPosition(siblings, target);
      // Tatsächlichen Effekt der Speicherfunktion nachbilden: belegte Zielwerte rücken nach hinten.
      const shifted = siblings.map((p) => ({ ...p, sort_order:
        siblings.some((s) => s.sort_order === sortOrder) && p.sort_order >= sortOrder ? p.sort_order + 1 : p.sort_order }));
      const result = [...shifted, { id: "edited", sort_order: sortOrder }].sort((a, b) => a.sort_order - b.sort_order);
      assert.equal(result.findIndex((p) => p.id === "edited") + 1, target);
    }
  }
});

test("Referenzstatus teilen sich einen Bereich und ein leerer Bereich beginnt mit Platz 1", () => {
  assert.deepEqual(positionSiblings(objects, "rented").map((p) => p.id), ["r"]);
  assert.equal(visiblePosition([], 200), 1);
  assert.equal(sortOrderForPosition([], 1), 0);
  assert.equal(sortOrderForPosition(positionSiblings(objects, "active"), 4), 51);
});
