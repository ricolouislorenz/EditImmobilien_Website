import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PAGE_METADATA, canonicalForPage, pageStructuredData } from '../src/lib/page-metadata.ts';

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function replaceExactlyOne(html, pattern, replacement) {
  if ([...html.matchAll(new RegExp(pattern.source, 'g'))].length !== 1) throw new Error(`SEO-Vorlage enthält ein fehlendes oder doppeltes Feld: ${pattern.source}`);
  return html.replace(pattern, () => replacement);
}

/** Statische Metadaten für direkte Seitenaufrufe; Links und Anwendungsskripte bleiben erhalten. */
export function renderPageMetadata(template, metadata) {
  let html = replaceExactlyOne(template, /<title>[^<]*<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`);
  for (const [name, content] of Object.entries({
    description: metadata.description, robots: metadata.robots,
    'og:title': metadata.title, 'og:description': metadata.description, 'og:url': canonicalForPage(metadata),
    'twitter:title': metadata.title, 'twitter:description': metadata.description,
  })) {
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    html = replaceExactlyOne(html, new RegExp(`<meta\\b[^>]*\\b${attribute}="${name}"[^>]*>`), `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`);
  }
  html = replaceExactlyOne(html, /<link\b[^>]*\brel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHtml(canonicalForPage(metadata))}" />`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => metadata.path === '/admin' ? ''
    : `<script type="application/ld+json">${JSON.stringify(pageStructuredData(JSON.parse(json), metadata)).replace(/</g, '\\u003c')}</script>`);
  if (metadata.path !== '/') html = html.replace(/<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="image")[^>]*>/g, '');
  return html;
}

export async function writeMetadataPages(directory) {
  const template = await readFile(join(directory, 'index.html'), 'utf8');
  await Promise.all(Object.values(PAGE_METADATA).map((metadata) => writeFile(
    join(directory, metadata.path === '/' ? 'index.html' : metadata.path.slice(1) + '.html'),
    renderPageMetadata(template, metadata), 'utf8',
  )));
}
