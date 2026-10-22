import assert from "node:assert/strict";
import { test } from "node:test";
import { onRequestPost as contact } from "../functions/api/contact.ts";
import { onRequestPost as expose } from "../functions/api/expose-request.ts";
import { MAX_FORM_BYTES } from "../server/form-validation.ts";

// Kein Netzwerk: Akzeptierte Anfragen landen ausschließlich beim simulierten Maildienst.
const env = { RESEND_API_KEY: "test-only", TURNSTILE_SECRET_KEY: "simulated-secret", TURNSTILE_ALLOWED_HOSTNAMES: "example.test" };
const common = { name: " Erika Muster ", email: "erika@example.com", message: "Hallo <Team>!\nRückruf bitte.", turnstile_token: "simulated-token" };

for (const endpoint of [
  { name: "Kontakt", handle: contact, valid: common, limits: { name: 200, email: 200, phone: 50, message: 5000, turnstile_token: 2048 }, required: ["name", "email", "message"] },
  { name: "Exposé", handle: expose, valid: { ...common, property_id: "EI-005", property_title: "Haus am Park" }, limits: { name: 200, email: 200, phone: 50, message: 2000, property_id: 100, property_title: 300, turnstile_token: 2048 }, required: ["name", "email", "property_id", "property_title"] },
]) {
  test(endpoint.name, async (t) => {
    const sent = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
      if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
        assert.deepEqual(JSON.parse(options.body), { secret: "simulated-secret", response: "simulated-token" });
        return Response.json({ success: true, hostname: "example.test", action: endpoint.name === "Kontakt" ? "contact" : "expose_request" });
      }
      assert.equal(url, "https://api.resend.com/emails");
      sent.push(JSON.parse(options.body));
      return Response.json({ id: "simulated-mail" });
    };
    t.after(() => { globalThis.fetch = originalFetch; });
    async function invoke(body, headers = { "Content-Type": "application/json" }) {
      return endpoint.handle({ request: new Request("https://example.test/api/form", { method: "POST", headers, body }), env });
    }
    async function reject(body, status = 400, headers) {
      const count = sent.length;
      const response = await invoke(body, headers);
      assert.equal(response.status, status);
      assert.equal(typeof (await response.json()).error, "string");
      assert.equal(sent.length, count, "Abgelehnte Anfragen dürfen keine Mail auslösen");
    }

    await t.test("Gültige Formulare: Texte bereinigt und HTML maskiert", async () => {
      const response = await invoke(JSON.stringify(endpoint.valid), { "Content-Type": "application/json; charset=utf-8" });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true });
      assert.equal(sent.length, 1);
      assert.equal(sent[0].reply_to, "erika@example.com");
      assert.match(sent[0].text, /Name: Erika Muster\n/);
      assert.match(sent[0].html, /&lt;Team&gt;/);
      assert.doesNotMatch(sent[0].html, /Hallo <Team>/);
    });
    await t.test("Fehlerhaftes JSON und falsche Grundstruktur", async () => {
      for (const body of ["", "{", "null", "[]", "123", '"text"', "true"]) await reject(body);
    });
    await t.test("Falsche Datentypen in jedem Feld", async () => {
      for (const field of Object.keys(endpoint.limits)) {
        for (const value of [123, null, {}, [], true]) {
          await reject(JSON.stringify({ ...endpoint.valid, [field]: value }));
        }
      }
    });
    await t.test("Feldgrenzen gelten auch vor dem Entfernen von Leerzeichen", async () => {
      for (const [field, max] of Object.entries(endpoint.limits)) {
        await reject(JSON.stringify({ ...endpoint.valid, [field]: "x".repeat(max + 1) }));
        await reject(JSON.stringify({ ...endpoint.valid, [field]: " ".repeat(max + 1) }));
      }
    });
    await t.test("Fehlende oder leere Pflichtfelder und ungültige E-Mail", async () => {
      for (const field of endpoint.required) {
        const missing = { ...endpoint.valid };
        delete missing[field];
        await reject(JSON.stringify(missing));
        await reject(JSON.stringify({ ...endpoint.valid, [field]: "  " }));
      }
      await reject(JSON.stringify({ ...endpoint.valid, email: "keine-email" }));
    });
    await t.test("Maximale zulässige Nachrichtenlänge mit Umlauten", async () => {
      const response = await invoke(JSON.stringify({ ...endpoint.valid, message: "ä".repeat(endpoint.limits.message) }));
      assert.equal(response.status, 200);
    });
    await t.test("Optionale Felder dürfen fehlen; unbekannte Felder werden nicht versendet", async () => {
      const payload = { ...endpoint.valid, extra: "nicht versenden" };
      if (endpoint.name === "Exposé") delete payload.message;
      assert.equal((await invoke(JSON.stringify(payload))).status, 200);
      assert.doesNotMatch(JSON.stringify(sent.at(-1)), /nicht versenden/);
    });
    await t.test("Genau 64 KiB bleiben erlaubt; fehlender Inhalt wird abgelehnt", async () => {
      const base = JSON.stringify({ ...endpoint.valid, extra: "" });
      const payload = JSON.stringify({ ...endpoint.valid, extra: "x".repeat(MAX_FORM_BYTES - Buffer.byteLength(base)) });
      assert.equal(Buffer.byteLength(payload), MAX_FORM_BYTES);
      assert.equal((await invoke(payload)).status, 200);
      await reject(undefined);
    });
    await t.test("Falscher oder fehlender Inhaltstyp", async () => {
      for (const headers of [{}, { "Content-Type": "text/plain" }, { "Content-Type": "application/x-www-form-urlencoded" }]) {
        await reject(JSON.stringify(endpoint.valid), 415, headers);
      }
    });
    await t.test("Größenlimit ohne und mit gefälschter Längenangabe", async () => {
      const body = JSON.stringify({ ...endpoint.valid, extra: "ä".repeat(MAX_FORM_BYTES / 2) });
      await reject(body, 413);
      await reject(body, 413, { "Content-Type": "application/json", "Content-Length": "1" });
      await reject("{}", 413, { "Content-Type": "application/json", "Content-Length": String(MAX_FORM_BYTES + 1) });
    });
    await t.test("Zu großer Datenstrom wird frühzeitig abgebrochen", async () => {
      let cancelled = false;
      let pulls = 0;
      const stream = new ReadableStream({
        pull(controller) { pulls++; controller.enqueue(new Uint8Array(1024)); },
        cancel() { cancelled = true; },
      }, { highWaterMark: 0 });
      const count = sent.length;
      const request = new Request("https://example.test/api/form", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half",
      });
      const response = await endpoint.handle({ request, env });
      assert.equal(response.status, 413);
      assert.equal(cancelled, true);
      assert.equal(pulls, MAX_FORM_BYTES / 1024 + 1);
      assert.equal(sent.length, count);
    });
    await t.test("Ungültiges UTF-8 und Übertragungsfehler", async () => {
      await reject(new Uint8Array([0xff, 0xfe]));
      const request = new Request("https://example.test/api/form", {
        method: "POST", headers: { "Content-Type": "application/json" }, duplex: "half",
        body: new ReadableStream({ start(controller) { controller.error(new Error("Verbindung abgebrochen")); } }),
      });
      const count = sent.length;
      assert.equal((await endpoint.handle({ request, env })).status, 400);
      assert.equal(sent.length, count);
    });

    await t.test("Fehlender oder leerer Turnstile-Nachweis: kein Mailversand", async () => {
      const missing = { ...endpoint.valid };
      delete missing.turnstile_token;
      await reject(JSON.stringify(missing), 403);
      await reject(JSON.stringify({ ...endpoint.valid, turnstile_token: " " }), 403);
    });

    await t.test("Fehlende Konfiguration und öffentliche Test-Secrets sperren den Versand", async () => {
      const count = sent.length;
      const forbiddenFetch = globalThis.fetch;
      globalThis.fetch = async () => assert.fail("Ohne Konfiguration kein externer Aufruf");
      try {
        for (const overrides of [
          { TURNSTILE_SECRET_KEY: "" },
          { TURNSTILE_ALLOWED_HOSTNAMES: "" },
          { TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA" },
          { TURNSTILE_SECRET_KEY: "2x0000000000000000000000000000000AA" },
          { TURNSTILE_SECRET_KEY: "3x0000000000000000000000000000000AA" },
        ]) {
          const request = new Request("https://example.test/api/form", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(endpoint.valid) });
          assert.equal((await endpoint.handle({ request, env: { ...env, ...overrides } })).status, 503);
        }
      } finally { globalThis.fetch = forbiddenFetch; }
      assert.equal(sent.length, count);
    });

    await t.test("Abgelehnte, abgelaufene und für fremde Domains/Formulare ausgestellte Nachweise", async () => {
      const fetchBefore = globalThis.fetch;
      try {
        for (const result of [
          { success: false, "error-codes": ["invalid-input-response"] },
          { success: false, "error-codes": ["timeout-or-duplicate"] },
          { success: true, hostname: "fremd.example", action: endpoint.name === "Kontakt" ? "contact" : "expose_request" },
          { success: true, hostname: "example.test", action: "anderes_formular" },
          { success: "true", hostname: "example.test", action: "contact" },
          { success: true },
        ]) {
          globalThis.fetch = async (url) => {
            assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
            return Response.json(result);
          };
          await reject(JSON.stringify(endpoint.valid), 403);
        }
      } finally { globalThis.fetch = fetchBefore; }
    });

    await t.test("Cloudflare-Ausfall oder ungültige Antwort: kein Mailversand", async () => {
      const fetchBefore = globalThis.fetch;
      try {
        for (const respond of [
          () => { throw new Error("Offline"); },
          () => new Response("Unavailable", { status: 503 }),
          () => new Response("Kein JSON"),
          () => Response.json(null),
          () => Response.json([]),
        ]) {
          globalThis.fetch = async (url) => {
            assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
            return respond();
          };
          await reject(JSON.stringify(endpoint.valid), 503);
        }
      } finally { globalThis.fetch = fetchBefore; }
    });

    await t.test("Zeitüberschreitung bricht Cloudflare-Prüfung ab und verhindert Mailversand", async () => {
      const fetchBefore = globalThis.fetch;
      const timeoutBefore = globalThis.setTimeout;
      globalThis.setTimeout = (callback) => timeoutBefore(callback, 1);
      globalThis.fetch = (url, options) => {
        assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
        return new Promise((resolve, reject) => {
          options.signal.addEventListener("abort", () => reject(new Error("Zeitlimit erreicht")), { once: true });
        });
      };
      try { await reject(JSON.stringify(endpoint.valid), 503); }
      finally {
        globalThis.fetch = fetchBefore;
        globalThis.setTimeout = timeoutBefore;
      }
    });
  });
}
