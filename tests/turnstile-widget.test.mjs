import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { JSDOM } = require(process.env.TURNSTILE_DOM_TEST_MODULE || "jsdom");
const { transformSync } = require("esbuild");
const React = require("react");
const { act } = React;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function fixture(t, siteKey = "simulated-site-key") {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://example.test" });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  const { createRoot } = require("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  const source = readFileSync(new URL("../src/components/TurnstileCheck.tsx", import.meta.url), "utf8");
  const code = transformSync(source, {
    loader: "tsx", format: "cjs", jsx: "automatic",
    define: { "import.meta.env.VITE_TURNSTILE_SITE_KEY": JSON.stringify(siteKey), "import.meta.env.PROD": "true" },
  }).code;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(require, module, module.exports);
  const Component = module.exports.TurnstileCheck;
  const tokens = [];
  const onTokenChange = (token) => tokens.push(token);
  let unmounted = false;
  async function render(refreshKey = 0, twice = false) {
    await act(async () => {
      const element = React.createElement(Component, { action: "contact", refreshKey, onTokenChange });
      root.render(twice ? React.createElement(React.Fragment, null, element,
        React.createElement(Component, { action: "expose_request", refreshKey, onTokenChange })) : element);
    });
  }
  async function unmount() {
    if (!unmounted) { await act(async () => root.unmount()); unmounted = true; }
  }
  t.after(async () => { await unmount(); dom.window.close(); delete globalThis.window; delete globalThis.document; });
  return { dom, render, tokens, unmount };
}

test("Ohne Site-Key wird kein externes Skript geladen und ein Hinweis angezeigt", async (t) => {
  const f = await fixture(t, "");
  assert.equal(document.scripts.length, 0);
  await f.render();
  assert.equal(document.scripts.length, 0);
  assert.match(document.querySelector('[role="alert"]').textContent, /vorübergehend nicht verfügbar/);
  assert.ok(f.tokens.every((token) => token === ""));
});

test("Öffentlicher Dummy-Site-Key wird im Produktions-Build abgelehnt", async (t) => {
  const f = await fixture(t, "1x00000000000000000000AA");
  await f.render();
  assert.equal(document.scripts.length, 0);
  assert.ok(document.querySelector('[role="alert"]'));
});

test("Dynamisches Laden, Tokenablauf, Erneuern und ignorierte alte Rückmeldungen", async (t) => {
  const f = await fixture(t);
  const options = [];
  const removed = [];
  await f.render();
  assert.equal(document.scripts.length, 1);
  assert.equal(document.scripts[0].src, "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
  window.turnstile = {
    ready(callback) { callback(); },
    render(container, config) { options.push(config); return String(options.length); },
    remove(id) { removed.push(id); },
  };
  await act(async () => document.scripts[0].dispatchEvent(new window.Event("load")));
  assert.equal(options[0].action, "contact");
  await act(async () => options[0].callback("first-token"));
  assert.equal(f.tokens.at(-1), "first-token");
  await act(async () => options[0]["expired-callback"]());
  assert.equal(f.tokens.at(-1), "");
  await f.render(1);
  assert.deepEqual(removed, ["1"]);
  assert.equal(options.length, 2);
  await act(async () => options[0].callback("stale-token"));
  assert.notEqual(f.tokens.at(-1), "stale-token");
  await act(async () => options[1].callback("new-token"));
  assert.equal(f.tokens.at(-1), "new-token");
  await f.unmount();
  assert.deepEqual(removed, ["1", "2"]);
  assert.equal(f.tokens.at(-1), "");
});

test("Zwei Formulare teilen ein Skript; Ladefehler lässt erneuten Versuch zu", async (t) => {
  const f = await fixture(t);
  await f.render(0, true);
  assert.equal(document.scripts.length, 1);
  await act(async () => document.scripts[0].dispatchEvent(new window.Event("error")));
  assert.equal(document.scripts.length, 0);
  assert.equal(document.querySelectorAll('[role="alert"]').length, 2);
  await act(async () => document.querySelector("button").click());
  assert.equal(document.scripts.length, 1);
  let config;
  window.turnstile = { ready(callback) { callback(); }, render(container, options) { config = options; return "widget"; }, remove() {} };
  await act(async () => document.scripts[0].dispatchEvent(new window.Event("load")));
  assert.equal(config.action, "contact");
  await act(async () => config.callback("verified"));
  assert.equal(f.tokens.at(-1), "verified");
  await act(async () => config["error-callback"]());
  assert.equal(f.tokens.at(-1), "");
  assert.match(document.querySelector('[role="alert"]').textContent, /erneut/);
});

test("Ein geschlossenes Formular wird nach verspätetem Skriptladen nicht mehr gerendert", async (t) => {
  const f = await fixture(t);
  await f.render();
  const script = document.scripts[0];
  await f.unmount();
  window.turnstile = { ready(callback) { callback(); }, render() { assert.fail("Formular bereits geschlossen"); }, remove() {} };
  await act(async () => script.dispatchEvent(new window.Event("load")));
  assert.ok(f.tokens.every((token) => token === ""));
});
