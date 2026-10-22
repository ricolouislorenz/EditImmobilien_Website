import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
const { JSDOM } = require(process.env.TURNSTILE_DOM_TEST_MODULE || 'jsdom');
const { build } = require('esbuild');
const React = require('react'); const { act } = React;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function fixture(t) {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test/admin' });
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  const { createRoot } = require('react-dom/client'); const { Simulate } = require('react-dom/test-utils');
  const { MemoryRouter } = require('react-router-dom');
  let tick; window.setInterval = (fn) => { tick = fn; return 1; }; window.clearInterval = () => {};
  const originalNow = Date.now; let time = originalNow(); Date.now = () => time;
  let listener;
  const session = { access_token: `header.${btoa(JSON.stringify({ session_id: 'session-one' }))}.signature`, user: { id: 'one', email: 'admin@example.test' } };
  const calls = [];
  const f = { result: { data: { status: 'active', remaining_seconds: 1800 }, error: null } };
  globalThis.__adminSessionTest = {
    auth: {
      getSession: async () => ({ data: { session } }),
      onAuthStateChange: (callback) => { listener = callback; return { data: { subscription: { unsubscribe() {} } } }; },
      signOut: async (options) => { calls.push(options); listener('SIGNED_OUT', null); return { error: null }; },
    },
    rpc: () => ({ abortSignal: async () => f.result }),
  };
  const compiled = await build({ entryPoints: ['src/admin/AdminApp.tsx'], bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic',
    external: ['react', 'react-dom', 'react-dom/*', 'react-router-dom'],
    plugins: [{ name: 'session-fixtures', setup(builder) {
      builder.onResolve({ filter: /^@\/lib\/supabase$/ }, () => ({ path: 'supabase', namespace: 'fixture' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: 'export const supabase = globalThis.__adminSessionTest;' }));
      builder.onResolve({ filter: /^\.\/(PropertiesPage|PropertyFormPage)$/ }, () => ({ path: 'pages', namespace: 'pages' }));
      builder.onLoad({ filter: /.*/, namespace: 'pages' }, () => ({ loader: 'jsx', contents: `
        import { useState } from 'react';
        export function PropertiesPage() { const [value, setValue] = useState(''); return <input aria-label="Ungespeicherter Inhalt" value={value} onChange={e => setValue(e.target.value)} />; }
        export const PropertyFormPage = PropertiesPage;
      ` }));
    } }],
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, module, module.exports);
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(module.exports.AdminApp))));
  t.after(async () => { await act(async () => root.unmount()); Date.now = originalNow; dom.window.close(); delete globalThis.window; delete globalThis.document; delete globalThis.localStorage; delete globalThis.__adminSessionTest; });
  return Object.assign(f, { calls, Simulate, advance: async (ms) => { time += ms; await act(async () => tick()); }, focus: async () => { await act(async () => window.dispatchEvent(new window.Event('focus'))); } });
}

test('Netzfehler sperrt Bedienung und erhält ungespeicherte Eingaben bis zur erfolgreichen Prüfung', async (t) => {
  const f = await fixture(t); const input = document.querySelector('input');
  await act(async () => f.Simulate.change(input, { target: { value: 'Noch nicht gespeichert' } }));
  f.result = { data: null, error: { message: 'Offline' } }; await f.advance(15000);
  assert.equal(document.querySelector('main').inert, true); assert.equal(document.querySelector('input').value, 'Noch nicht gespeichert');
  f.result = { data: { status: 'active', remaining_seconds: 1785 }, error: null };
  await act(async () => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Erneut prüfen').click());
  assert.equal(document.querySelector('main').inert, false); assert.equal(document.querySelector('input').value, 'Noch nicht gespeichert');
});

test('Ersetzte Sitzung zeigt die Anmeldung mit Erklärung und meldet ausschließlich lokal ab', async (t) => {
  const f = await fixture(t); f.result = { data: { status: 'replaced' }, error: null }; await f.focus();
  assert.match(document.body.textContent, /erneut angemeldet/); assert.equal(document.querySelector('main'), null);
  assert.deepEqual(f.calls, [{ scope: 'local' }]);
});
