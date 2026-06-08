/**
 * Bild-Pipeline: erzeugt aus den Original-Quellen in assets-source/ optimierte,
 * responsive Varianten in public/images/<bereich>/.
 *
 * Neues Bild aufnehmen:
 *   1. Original (hohe Auflösung) in assets-source/ ablegen
 *   2. Unten einen Eintrag in JOBS ergänzen
 *   3. `npm run optimize:images` ausführen
 *   4. In src/lib/assets.ts den passenden ResponsiveImage-Eintrag pflegen
 *
 * Es wird nie hochskaliert (withoutEnlargement). WebP für die Anzeige,
 * zusätzlich optional ein JPG als verlässlicher Fallback (z. B. og:image).
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC_DIR = path.resolve(__dirname, "..", "assets-source");
const OUT_DIR = path.resolve(__dirname, "..", "public", "images");

const WEBP_QUALITY = 80;
const JPG_QUALITY = 82;

/**
 * widths  – Zielbreiten der WebP-Varianten (Smartphone → Tablet → PC)
 * jpg     – optionaler Raster-Fallback { width } (für Social-Scraper)
 */
const JOBS = [
  { src: "hero.png", outDir: "hero", name: "hero", widths: [768, 1100, 1456], jpg: { width: 1456 } },
  { src: "team-timo.jpg", outDir: "team", name: "timo", widths: [320, 480] },
  { src: "team-sarah.jpg", outDir: "team", name: "sarah", widths: [320, 480] },
  { src: "team-group.jpg", outDir: "team", name: "group", widths: [400, 500] },
];

async function run() {
  for (const job of JOBS) {
    const srcPath = path.join(SRC_DIR, job.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠  Quelle fehlt, übersprungen: ${job.src}`);
      continue;
    }

    const outDir = path.join(OUT_DIR, job.outDir);
    fs.mkdirSync(outDir, { recursive: true });

    for (const width of job.widths) {
      const out = path.join(outDir, `${job.name}-${width}.webp`);
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toFile(out);
      report(out);
    }

    if (job.jpg) {
      const out = path.join(outDir, `${job.name}.jpg`);
      await sharp(srcPath)
        .resize({ width: job.jpg.width, withoutEnlargement: true })
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toFile(out);
      report(out);
    }
  }
}

function report(file) {
  const kb = (fs.statSync(file).size / 1024).toFixed(0);
  console.log(`✓ ${path.relative(OUT_DIR, file).padEnd(28)} ${kb} KB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
