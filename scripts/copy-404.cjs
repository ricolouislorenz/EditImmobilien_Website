// Kopiert build/index.html nach build/404.html, damit GitHub Pages SPA-Routing
// (z. B. Direktaufruf von /admin, Seiten-Reload) funktioniert.
const fs = require("node:fs");
const path = require("node:path");

const buildDir = path.resolve(__dirname, "..", "build");
const source = path.join(buildDir, "index.html");
const target = path.join(buildDir, "404.html");

if (!fs.existsSync(source)) {
  console.error(`copy-404: ${source} existiert nicht – wurde \`vite build\` ausgeführt?`);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`copy-404: build/404.html erzeugt (SPA-Fallback für GitHub Pages).`);
