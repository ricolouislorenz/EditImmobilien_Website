import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { JSDOM } = require(process.env.TURNSTILE_DOM_TEST_MODULE || "jsdom");
const { build } = require("esbuild");
const React = require("react");
const { act } = React;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function fixture(t, siblings = []) {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://example.test/admin/properties/new" });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.sessionStorage = dom.window.sessionStorage;
  const { createRoot } = require("react-dom/client");
  const { Simulate } = require("react-dom/test-utils");
  const { MemoryRouter } = require("react-router-dom");
  const savedIds = [];
  const savedPayloads = [];
  const root = createRoot(document.getElementById("root"));
  const compiled = await build({
    entryPoints: ["src/admin/PropertyFormPage.tsx"], bundle: true, write: false, platform: "node", format: "cjs", jsx: "automatic",
    external: ["react", "react-dom", "react-dom/*", "react-router-dom"],
    plugins: [{ name: "supabase-test-double", setup(build) {
      build.onResolve({ filter: /^@\/lib\/supabase$/ }, () => ({ path: "supabase", namespace: "test" }));
      build.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: `
        export const supabase = globalThis.__propertyFormTest.supabase;
        export const uploadImages = globalThis.__propertyFormTest.uploadImages;
        export const getImageUrl = () => '';
      ` }));
    } }],
  });
  const actions = {
    save: async () => ({ data: null, error: null }),
    uploadImages: async () => [],
    supabase: {
      rpc(name, args) {
        assert.equal(name, "save_property", "Kein separater Aufruf der alten Sortierfunktion");
        assert.equal(args.p_is_new, true);
        assert.equal(args.p_property.id, undefined);
        assert.equal(args.p_property.created_at, undefined);
        assert.equal(args.p_property.updated_at, undefined);
        savedIds.push(args.p_id);
        savedPayloads.push(args.p_property);
        return actions.save();
      },
      storage: { from: () => ({ remove: async () => assert.fail("Keine Löschung bei unklarem Speicherergebnis") }) },
      from: () => ({
        select: async () => ({ data: siblings }),
        insert() { assert.fail("Kein getrennter INSERT neben dem gemeinsamen RPC"); },
      }),
    },
  };
  globalThis.__propertyFormTest = actions;
  const module = { exports: {} };
  new Function("require", "module", "exports", compiled.outputFiles[0].text)(require, module, module.exports);
  await act(async () => root.render(React.createElement(MemoryRouter, { initialEntries: ["/admin/properties/new"] },
    React.createElement(module.exports.PropertyFormPage))));
  // Ortslookup ausschließlich simulieren, damit kein externer Dienst aufgerufen wird.
  globalThis.fetch = async () => Response.json({ places: [] });
  await act(async () => {
    Simulate.change(document.querySelector('[name="plz"]'), { target: { value: "25488" } });
    Simulate.change(document.querySelector('[name="ort"]'), { target: { value: "Holm" } });
  });
  async function submit() {
    await act(async () => document.querySelector("form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true })));
  }
  t.after(async () => {
    await act(async () => root.unmount()); dom.window.close();
    delete globalThis.window; delete globalThis.document; delete globalThis.sessionStorage; delete globalThis.__propertyFormTest;
  });
  return { actions, savedIds, savedPayloads, submit, Simulate };
}

test("Unklare Speicherung sperrt erneutes Absenden und bietet denselben Datensatz zur Prüfung an", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const f = await fixture(t);
  f.actions.save = async () => { throw new Error("Antwort unterbrochen"); };
  await f.submit();
  assert.equal(f.savedIds.length, 1);
  assert.equal(document.querySelector('button[type="submit"]').disabled, true);
  const inspectLink = document.querySelector(`a[href="/admin/properties/${f.savedIds[0]}"]`);
  assert.ok(inspectLink);
  assert.match(document.querySelector('[role="alert"]').textContent, /nicht eindeutig bestätigt/);
  await f.submit();
  assert.equal(f.savedIds.length, 1, "Auch programmatisches Absenden darf den unbekannten Vorgang nicht wiederholen");
});

test("Während eines offenen Speichervorgangs wird kein zweiter Datensatz gesendet", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const f = await fixture(t);
  let resolveSave;
  f.actions.save = () => new Promise((resolve) => { resolveSave = resolve; });
  await f.submit();
  await f.submit();
  assert.equal(f.savedIds.length, 1);
  await act(async () => resolveSave({ data: null, error: null }));
  assert.equal(document.querySelector('button[type="submit"]').disabled, true);
});

test("Eindeutig abgelehnter Speicherversuch kann mit derselben Immobilien-ID wiederholt werden", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const f = await fixture(t);
  f.actions.save = async () => ({ data: null, error: { code: "23502" } });
  await f.submit();
  assert.equal(document.querySelector('button[type="submit"]').disabled, false);
  await f.submit();
  assert.equal(f.savedIds.length, 2);
  assert.equal(f.savedIds[0], f.savedIds[1]);
});

const positionExamples = [
  { id: "a", title: "Haus am See", status: "active", sort_order: 10 },
  { id: "r", title: "Verkauftes Haus", status: "sold", sort_order: 15 },
  { id: "b", title: "Wohnung im Zentrum", status: "active", sort_order: 30 },
];

test("Sichtbare Platzauswahl und Speichern stimmen trotz Sortierlücken überein", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const f = await fixture(t, positionExamples);
  assert.match(document.body.textContent, /Platz 1 von 3/);
  assert.equal(document.querySelector('button').type, "button");
  const down = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Einen Platz tiefer"));
  await act(async () => down.click());
  assert.match(document.body.textContent, /Platz 2 von 3/);
  assert.equal(document.querySelector("#property-position").value, "2");
  assert.match(document.querySelector('#property-position option:checked').textContent, /Wohnung im Zentrum/);
  assert.equal(f.savedIds.length, 0, "Positionswahl darf noch nichts speichern");
  f.actions.save = async () => ({ data: null, error: { code: "23502" } });
  await f.submit();
  assert.equal(f.savedPayloads[0].sort_order, 30, "Platz 2 ist der Sortierwert des nächsten sichtbaren Objekts");
});

test("Anfang, Ende und Bereichswechsel zeigen nur die jeweilige Website-Liste", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const f = await fixture(t, positionExamples);
  const button = (text) => [...document.querySelectorAll("button")].find((b) => b.textContent.includes(text));
  assert.equal(button("Ganz nach oben").disabled, true);
  await act(async () => button("Ganz nach unten").click());
  assert.match(document.body.textContent, /Platz 3 von 3/);
  assert.equal(button("Ganz nach unten").disabled, true);
  await act(async () => f.Simulate.change(document.querySelector("#property-position"), { target: { value: "1" } }));
  assert.match(document.body.textContent, /Platz 1 von 3/);
  await act(async () => button("Referenzobjekt").click());
  assert.match(document.body.textContent, /Platz 1 von 2/);
  const choices = document.querySelector("#property-position");
  assert.match(choices.textContent, /Verkauftes Haus/);
  assert.doesNotMatch(choices.textContent, /Haus am See|Wohnung im Zentrum/);
});
