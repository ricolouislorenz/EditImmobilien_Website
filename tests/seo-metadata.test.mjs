import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { PAGE_METADATA, canonicalForPage, pageMetadataForPath } from '../src/lib/page-metadata.ts';
import { renderPageMetadata, writeMetadataPages } from '../scripts/page-metadata.mjs';
const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const structured = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test('Jede öffentliche Seite erhält eigene statische Metadaten; Firmendaten und App-Einstieg bleiben erhalten', () => {
  const original = structured(template)['@graph'].filter(e => e['@type'] !== 'WebPage');
  for (const meta of [PAGE_METADATA.home, PAGE_METADATA.impressum, PAGE_METADATA.datenschutz]) {
    const html = renderPageMetadata(template, meta);
    assert.ok(html.includes(`<link rel="canonical" href="${canonicalForPage(meta)}" />`));
    assert.ok(html.includes(`content="${meta.description}"`));
    assert.deepEqual(structured(html)['@graph'].filter(e => e['@type'] !== 'WebPage'), original);
    assert.equal(structured(html)['@graph'].find(e => e['@type'] === 'WebPage').url, canonicalForPage(meta));
    assert.match(html, /<script type="module" src="\/src\/main.tsx"><\/script>/);
    assert.equal(html.includes('rel="preload"'), meta.path === '/');
  }
});

test('Navigation zu Unterrouten und zurück setzt passende Indexierung und Canonicals', () => {
  assert.equal(pageMetadataForPath('/impressum/'), PAGE_METADATA.impressum);
  assert.equal(pageMetadataForPath('/datenschutz'), PAGE_METADATA.datenschutz);
  assert.equal(pageMetadataForPath('/admin/properties/123'), PAGE_METADATA.admin);
  assert.equal(pageMetadataForPath('/'), PAGE_METADATA.home);
  assert.match(renderPageMetadata(template, PAGE_METADATA.admin), /content="noindex, nofollow"/);
  assert.doesNotMatch(template, /name="(?:keywords|revisit-after)"/);
});

test('Fehlende Canonical-Vorlage stoppt den Build statt falsche Seiten auszuliefern', () => {
  assert.throws(() => renderPageMetadata(template.replace(/<link rel="canonical"[^>]*>/, ''), PAGE_METADATA.impressum), /fehlendes oder doppeltes Feld/);
});

test('Cloudflare-Regeln erhalten alte Weiterleitungen und Admin-Unterpfade, ohne Assets oder APIs umzuleiten', async () => {
  const redirects = (await readFile(new URL('../public/_redirects', import.meta.url), 'utf8')).split('\n')
    .map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
  const match = (url) => redirects.find(([pattern]) => new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '.*') + '$').test(url));
  assert.deepEqual(match('/ueber-uns').slice(1), ['/#uber-uns', '301']);
  assert.deepEqual(match('/admin/properties/example').slice(1), ['/admin', '200']);
  for (const url of ['/assets/main.js', '/images/hero/hero.jpg', '/api/contact', '/api/expose-request', '/impressum', '/datenschutz']) assert.equal(match(url), undefined, url);
});

test('Build schreibt alle Seiten in den übergebenen Ausgabeordner und erhält Scriptpfade', async (t) => {
  const prefix = join(tmpdir(), 'edit-seo-test-');
  const directory = await mkdtemp(prefix);
  assert.ok(resolve(directory).startsWith(resolve(prefix)));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'index.html'), template);
  await writeMetadataPages(directory);
  for (const meta of Object.values(PAGE_METADATA)) {
    const html = await readFile(join(directory, meta.path === '/' ? 'index.html' : meta.path.slice(1) + '.html'), 'utf8');
    assert.ok(html.includes(canonicalForPage(meta)));
    assert.match(html, /\/src\/main.tsx/);
  }
});
