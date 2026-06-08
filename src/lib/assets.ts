/**
 * Zentrale Verwaltung aller statischen Website-Assets.
 *
 * Foto ersetzen/hinzufügen (responsive Bilder):
 *   1. Original (hohe Auflösung) in assets-source/ ablegen
 *   2. Eintrag in scripts/optimize-images.cjs ergänzen
 *   3. `npm run optimize:images` ausführen (erzeugt WebP-Varianten in public/images/<bereich>/)
 *   4. Hier den passenden ResponsiveImage-Eintrag pflegen
 *   5. In der Komponente aus dieser Datei importieren – nie Pfade direkt im JSX
 *
 * Einfache (nicht responsive) Assets wie Logo/SVG bleiben simple String-Pfade.
 */

// Basis-URL aus Vite-Konfiguration (z. B. / in Produktion)
const base = import.meta.env.BASE_URL;

/** Hilfsfunktion: lokale public/images/-Pfade korrekt mit BASE_URL prefixen */
function publicImage(filename: string): string {
  return `${base}images/${filename}`;
}

/**
 * Responsive Bildquelle: `src` als Standard, `srcSet`/Breiten für die
 * Geräteklassen (Smartphone/Tablet/PC). `width`/`height` reservieren Platz
 * und vermeiden Layout-Shift (CLS).
 */
export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/** Baut einen srcSet-String aus Dateiname-Schema `<prefix>-<breite>.webp`. */
function srcSet(prefix: string, widths: number[]): string {
  return widths.map((w) => `${publicImage(`${prefix}-${w}.webp`)} ${w}w`).join(", ");
}

// ─── Marke ───────────────────────────────────────────────────────────────────

/** Logo in der Navbar. Ersetzen: public/images/logo.png überschreiben. */
export const LOGO = publicImage("logo.png");

// ─── Hero ────────────────────────────────────────────────────────────────────

/**
 * Hintergrundbild im Hero-Bereich (LCP-Element, eager geladen).
 * Quelle: assets-source/hero.png → `npm run optimize:images`.
 */
export const HERO_IMAGE: ResponsiveImage = {
  src: publicImage("hero/hero-1456.webp"),
  srcSet: srcSet("hero/hero", [768, 1100, 1456]),
  width: 1456,
  height: 816,
};

/** Raster-Fallback (JPG) des Hero-Bilds für Social-Scraper (og:image). */
export const HERO_OG_IMAGE = publicImage("hero/hero.jpg");

// ─── Team ────────────────────────────────────────────────────────────────────

/** Gruppen-Teamfoto (Leistungen-Sektion). Quelle: assets-source/team-group.jpg. */
export const TEAM_FOTO: ResponsiveImage = {
  src: publicImage("team/group-500.webp"),
  srcSet: srcSet("team/group", [400, 500]),
  width: 500,
  height: 350,
};

/** Porträtfoto Timo. Quelle: assets-source/team-timo.jpg. */
export const TEAM_TIMO: ResponsiveImage = {
  src: publicImage("team/timo-480.webp"),
  srcSet: srcSet("team/timo", [320, 480]),
  width: 480,
  height: 720,
};

/** Porträtfoto Sarah. Quelle: assets-source/team-sarah.jpg. */
export const TEAM_SARAH: ResponsiveImage = {
  src: publicImage("team/sarah-480.webp"),
  srcSet: srcSet("team/sarah", [320, 480]),
  width: 480,
  height: 720,
};

// ─── Immobilien ──────────────────────────────────────────────────────────────

/**
 * Platzhalterbild für Immobilien ohne eigenes Foto.
 * Liegt unter public/images/property-placeholder.svg.
 */
export const PROPERTY_PLACEHOLDER = publicImage("property-placeholder.svg");
