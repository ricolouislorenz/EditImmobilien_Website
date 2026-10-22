import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
const { JSDOM } = require(process.env.TURNSTILE_DOM_TEST_MODULE || 'jsdom');
const { build } = require('esbuild'); const React = require('react'); const { act } = React;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');

async function fixture(t, entry, plugins = []) {
  const dom = new JSDOM(template, { url: 'https://example.test/' });
  const previous = new Map();
  for (const key of ['window', 'document', 'Node', 'NodeFilter', 'Element', 'HTMLElement', 'HTMLInputElement', 'MutationObserver', 'CustomEvent', 'DocumentFragment', 'getComputedStyle']) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
  }
  const { createRoot } = require('react-dom/client'); const { Simulate } = require('react-dom/test-utils'); const { MemoryRouter, Link } = require('react-router-dom');
  const compiled = await build({ entryPoints: [entry], bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic',
    external: ['react', 'react-dom', 'react-dom/*', 'react-router-dom'], plugins,
  });
  const module = { exports: {} }; new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, module, module.exports);
  const root = createRoot(document.getElementById('root'));
  t.after(async () => {
    await act(async () => root.unmount()); dom.window.close();
    for (const [key, descriptor] of previous) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  });
  return { root, exports: module.exports, Simulate, MemoryRouter, Link };
}

test('Seitennavigation setzt Titel, Beschreibung und Canonical; Rückkehr zur Startseite stellt alles wieder her', async (t) => {
  const f = await fixture(t, 'src/components/SEOHead.tsx');
  await act(async () => f.root.render(React.createElement(f.MemoryRouter, null, React.createElement(React.Fragment, null,
    React.createElement(f.exports.SEOHead), ...['/impressum', '/datenschutz', '/admin/properties/new', '/'].map(to => React.createElement(f.Link, { key: to, to }, to)),
  ))));
  const title = document.title;
  const description = document.querySelector('meta[name="description"]').content;
  async function go(path) { await act(async () => [...document.querySelectorAll('a')].find(a => a.textContent === path).click()); }
  await go('/impressum'); assert.match(document.title, /^Impressum/); assert.equal(document.querySelector('[rel="canonical"]').href, 'https://edit-immobilien.de/impressum');
  await go('/datenschutz'); assert.match(document.title, /^Datenschutz/); assert.equal(document.querySelector('meta[property="og:url"]').content, 'https://edit-immobilien.de/datenschutz');
  await go('/admin/properties/new'); assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex, nofollow');
  await go('/'); assert.equal(document.title, title); assert.equal(document.querySelector('meta[name="description"]').content, description);
  assert.equal(document.querySelector('[rel="canonical"]').href, 'https://edit-immobilien.de/');
  assert.match(document.querySelector('meta[name="robots"]').content, /^index,/);
});

async function downloadsFixture(t) {
  const probe = { calls: [], loaded: [], successes: [], errors: [], generate: async () => {} };
  globalThis.__downloadProbe = probe; t.after(() => { delete globalThis.__downloadProbe; });
  const generators = { HausverkaufCheckliste: 'generateHausverkaufChecklistePDF', WertsteigerungRenovierung: 'generateWertsteigerungRenovierungPDF', HaeufigsteFehler: 'generateHaeufigsteFehlerPDF' };
  const f = await fixture(t, 'src/components/DownloadsSection.tsx', [{ name: 'download-probe', setup(builder) {
    builder.onResolve({ filter: /^sonner$/ }, () => ({ path: 'toast', namespace: 'fixture' }));
    builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: 'export const toast = { success: (...args) => globalThis.__downloadProbe.successes.push(args), error: (...args) => globalThis.__downloadProbe.errors.push(args) };' }));
    builder.onLoad({ filter: /(HausverkaufCheckliste|WertsteigerungRenovierung|HaeufigsteFehler)\.tsx$/ }, ({ path }) => {
      const name = Object.keys(generators).find(name => path.includes(name));
      return { contents: `globalThis.__downloadProbe.loaded.push('${name}'); export function ${generators[name]}() { globalThis.__downloadProbe.calls.push('${name}'); return globalThis.__downloadProbe.generate(); }` };
    });
  } }]);
  await act(async () => f.root.render(React.createElement(f.exports.DownloadsSection)));
  assert.deepEqual(probe.loaded, [], 'Beim Rendern keine PDF-Bibliothek laden');
  await act(async () => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Jetzt herunterladen')).click());
  assert.deepEqual(probe.loaded, [], 'Auch das reine Öffnen des Dialogs lädt noch keinen PDF-Code');
  await act(async () => {
    f.Simulate.change(document.querySelector('#name'), { target: { value: 'Erika Muster' } });
    f.Simulate.change(document.querySelector('#email'), { target: { value: 'erika@example.test' } });
  });
  return { probe, submit: async () => { await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))); } };
}

test('Downloadfehler erhält Eingaben und erlaubt Wiederholung; Erfolg behauptet keinen E-Mail-Versand', async (t) => {
  const f = await downloadsFixture(t); f.probe.generate = async () => { throw new Error('Ladefehler'); };
  await f.submit(); assert.equal(f.probe.errors.length, 1); assert.equal(f.probe.successes.length, 0);
  assert.equal(document.querySelector('#email').value, 'erika@example.test');
  f.probe.generate = async () => {}; await f.submit();
  assert.equal(f.probe.successes.length, 1); assert.doesNotMatch(JSON.stringify(f.probe.successes), /E-Mail|zugeschickt/);
  assert.equal(document.querySelector('form'), null);
});

test('Offene PDF-Anforderung lässt sich nicht doppelt absenden oder vorzeitig schließen', async (t) => {
  const f = await downloadsFixture(t); let finish; f.probe.generate = () => new Promise(resolve => { finish = resolve; });
  await f.submit(); await f.submit(); assert.equal(f.probe.calls.length, 1);
  assert.equal([...document.querySelectorAll('button')].find(b => b.textContent === 'Abbrechen').disabled, true);
  await act(async () => finish()); assert.equal(f.probe.successes.length, 1);
});
