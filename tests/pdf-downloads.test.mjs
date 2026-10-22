import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
const { build } = require('esbuild');
const cases = [
  ['checkliste-hausverkauf.pdf', 'HausverkaufCheckliste', 'generateHausverkaufChecklistePDF'],
  ['guide-wertsteigerung.pdf', 'WertsteigerungRenovierung', 'generateWertsteigerungRenovierungPDF'],
  ['fehler-vermeiden.pdf', 'HaeufigsteFehler', 'generateHaeufigsteFehlerPDF'],
];

test('Kein PDF-Modul vor der Anforderung laden; je Download nur den gewählten Generator ausführen', async () => {
  globalThis.__pdfProbe = { loaded: [], generated: [] };
  try {
    const compiled = await build({ entryPoints: ['src/lib/pdf-downloads.ts'], bundle: true, write: false, platform: 'node', format: 'cjs',
      plugins: [{ name: 'pdf-probe', setup(builder) {
        builder.onLoad({ filter: /(HausverkaufCheckliste|WertsteigerungRenovierung|HaeufigsteFehler)\.tsx$/ }, ({ path }) => {
          const entry = cases.find(([, name]) => path.includes(name));
          return { contents: `globalThis.__pdfProbe.loaded.push('${entry[1]}'); export function ${entry[2]}() { globalThis.__pdfProbe.generated.push('${entry[1]}'); }` };
        });
      } }],
    });
    const module = { exports: {} }; new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, module, module.exports);
    assert.deepEqual(globalThis.__pdfProbe.loaded, []);
    await module.exports.generateDownloadPdf(cases[0][0]);
    assert.deepEqual(globalThis.__pdfProbe.loaded, [cases[0][1]]);
    await module.exports.generateDownloadPdf(cases[1][0]);
    await module.exports.generateDownloadPdf(cases[2][0]);
    assert.deepEqual(globalThis.__pdfProbe.generated, cases.map(([, name]) => name));
    await assert.rejects(module.exports.generateDownloadPdf('unbekannt.pdf'), /nicht verfügbar/);
  } finally { delete globalThis.__pdfProbe; }
});

test('Alle drei echten Generatoren erzeugen weiterhin gültige PDF-Dateien, ohne einen Download auszuführen', async () => {
  const { jsPDF } = require('jspdf'); const saved = [];
  const profile = await require('sharp')({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } }).png().toBuffer();
  class TestPdf extends jsPDF {
    constructor(...args) {
      super(...args);
      const addImage = this.addImage.bind(this);
      // Externen Profil-Platzhalter lokal ersetzen; auch im Test keinen Netzwerkzugriff ausführen.
      this.addImage = (image, ...args) => addImage(typeof image === 'string' && image.startsWith('https://placehold.co/') ? profile : image, ...args);
      // jsPDF liefert ein eigenes API-Objekt zurück: save auf dieser Instanz ersetzen.
      this.save = (name) => { const bytes = Buffer.from(this.output('arraybuffer')); assert.equal(bytes.subarray(0, 5).toString(), '%PDF-'); assert.ok(bytes.length > 1000); saved.push(name); return this; };
    }
  }
  const compiled = await build({ stdin: { contents: cases.map(([, name, fn]) => `export { ${fn} } from './src/components/${name}';`).join('\n'), resolveDir: process.cwd(), loader: 'ts' },
    bundle: true, write: false, platform: 'node', format: 'cjs', external: ['jspdf'],
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)((name) => name === 'jspdf' ? { __esModule: true, default: TestPdf } : require(name), module, module.exports);
  for (const [, , fn] of cases) module.exports[fn]();
  assert.equal(saved.length, 3); assert.equal(new Set(saved).size, 3);
});
