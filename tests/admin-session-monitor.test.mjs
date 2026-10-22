import assert from 'node:assert/strict';
import { test } from 'node:test';
import { monitorAdminSession } from '../src/lib/admin-session-monitor.ts';
import { ADMIN_IDLE_MS, ADMIN_WARNING_MS } from '../src/lib/admin-session.ts';
const flush = () => new Promise((resolve) => setImmediate(resolve));
async function fixture(t) {
  let time = 1700000000000;
  let tick;
  const win = new EventTarget();
  win.setInterval = (fn) => { tick = fn; return 1; };
  win.clearInterval = () => {};
  const doc = new EventTarget(); doc.visibilityState = 'visible';
  const values = new Map(); const previousStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const states = []; const endings = []; const checks = [];
  const f = { response: { status: 'active', remaining_seconds: 1800 }, fail: false };
  const monitor = monitorAdminSession({
    key: 'session', now: () => time, win, doc,
    check: async (activity) => { checks.push(activity); if (f.fail) throw new Error('offline'); return f.response; },
    onState: (s) => states.push(s), onEnd: (s) => endings.push(s),
  });
  await flush();
  t.after(() => { monitor.stop(); if (previousStorage === undefined) delete globalThis.localStorage; else globalThis.localStorage = previousStorage; });
  return Object.assign(f, { states, endings, checks, monitor, win, doc, values,
    advance: async (ms) => { time += ms; tick(); await flush(); },
    activity: async () => { win.dispatchEvent(new Event('keydown')); await flush(); },
    currentTime: () => time,
  });
}

test('Vorwarnung nach 28 Minuten, Abmeldung nach 30; reine Prüfungen verlängern nicht', async (t) => {
  const f = await fixture(t);
  assert.equal(f.states.at(-1).phase, 'active');
  await f.advance(ADMIN_IDLE_MS - ADMIN_WARNING_MS);
  assert.equal(f.states.at(-1).remainingMs, ADMIN_WARNING_MS);
  assert.deepEqual(f.checks, [false, false]);
  await f.advance(ADMIN_WARNING_MS);
  assert.equal(f.endings.length, 1); assert.match(f.endings[0], /30 Minuten/);
  await f.advance(1000); assert.equal(f.endings.length, 1);
});

test('Bedienung und Angemeldet bleiben verlängern; abgelaufene Sitzung kann nicht reaktiviert werden', async (t) => {
  const f = await fixture(t);
  await f.advance(ADMIN_IDLE_MS - 60000);
  f.monitor.stay(); await flush();
  assert.equal(f.checks.at(-1), true);
  assert.equal(f.states.at(-1).remainingMs, ADMIN_IDLE_MS);
  await f.advance(ADMIN_IDLE_MS + 1000);
  await f.activity(); assert.equal(f.endings.length, 1);
});

test('Neue Anmeldung beendet nur die ältere Sitzung und meldet den Grund', async (t) => {
  const f = await fixture(t); f.response = { status: 'replaced' };
  await f.advance(15000); assert.match(f.endings[0], /erneut angemeldet/);
  assert.equal(f.endings.length, 1);
});

test('Verbindungsfehler sperren vorübergehend; Wiederholung erhält die Sitzung ohne neue Aktivität', async (t) => {
  const f = await fixture(t); f.fail = true;
  await f.advance(15000); assert.equal(f.states.at(-1).phase, 'unavailable');
  await f.advance(1000); assert.equal(f.states.at(-1).phase, 'unavailable');
  await f.activity(); assert.equal(f.values.size, 0, 'Gesperrte Oberfläche meldet keine Bedienaktivität');
  f.fail = false; f.monitor.retry(); await flush();
  assert.equal(f.states.at(-1).phase, 'active'); assert.equal(f.checks.at(-1), false);
});

test('Nach Ruhezustand vor jeder neuen Bedienung die Frist prüfen', async (t) => {
  const f = await fixture(t);
  await f.advance(ADMIN_IDLE_MS + 1);
  f.win.dispatchEvent(new Event('focus')); await f.activity();
  assert.equal(f.endings.length, 1); assert.deepEqual(f.checks, [false]);
});

test('Aktivität eines zweiten Tabs derselben Sitzung zählt mit', async (t) => {
  const f = await fixture(t); await f.advance(20 * 60000);
  f.values.set('session', String(f.currentTime()));
  const event = new Event('storage'); Object.defineProperty(event, 'key', { value: 'session' });
  f.win.dispatchEvent(event); await f.advance(15 * 60000);
  assert.equal(f.endings.length, 0); assert.equal(f.states.at(-1).remainingMs, 15 * 60000);
  assert.equal(f.checks.at(-1), true);
});

test('Beendeter Monitor verarbeitet keine verspätete Serverantwort mehr', async (t) => {
  const f = await fixture(t); const before = f.states.length;
  f.monitor.stop(); await f.advance(60000); await f.activity();
  assert.equal(f.states.length, before); assert.equal(f.endings.length, 0);
});
