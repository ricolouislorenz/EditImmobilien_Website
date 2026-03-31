/**
 * Zentrale Verwaltung aller statischen Website-Assets.
 *
 * Bild hinzufügen:
 *   1. Datei in public/images/ ablegen (z. B. public/images/team.jpg)
 *   2. Hier als Konstante eintragen
 *   3. In der Komponente aus dieser Datei importieren – nie Pfade direkt im JSX
 *
 * Bild ersetzen:
 *   – Gleicher Dateiname → Datei einfach überschreiben, kein Code nötig
 *   – Anderer Dateiname → Pfad hier anpassen, Änderung wirkt überall
 */

// Basis-URL aus Vite-Konfiguration (z. B. /EditImmobilien_Website/ in Produktion)
const base = import.meta.env.BASE_URL;

/** Hilfsfunktion: lokale public/images/-Pfade korrekt mit BASE_URL prefixen */
function publicImage(filename: string): string {
  return `${base}images/${filename}`;
}

// ─── Marke ───────────────────────────────────────────────────────────────────

/** Logo in der Navbar. Ersetzen: public/images/logo.png überschreiben. */
export const LOGO = publicImage("logo.png");

// ─── Hero ────────────────────────────────────────────────────────────────────

/**
 * Hintergrundbild im Hero-Bereich.
 * Eigenes Bild unter public/images/hero-bg.jpg ablegen → Wert auf publicImage("hero-bg.jpg") setzen.
 * Empfohlene Größe: mind. 1920×1080px
 */
export const HERO_BG = publicImage("hero-bg.png");

// ─── Team ────────────────────────────────────────────────────────────────────

/**
 * Gruppen-Teamfoto (Über-uns-Sektion).
 * Platzhalter liegt unter public/images/team.svg.
 * Echtes Bild: public/images/team.jpg ablegen → Wert auf publicImage("team.jpg") setzen.
 * Empfohlene Größe: 800×600px
 */
export const TEAM_FOTO = publicImage("team.jpg");

/**
 * Porträtfoto Timo.
 * Platzhalter liegt unter public/images/team-timo.svg.
 * Echtes Bild: public/images/team-timo.jpg ablegen → Wert auf publicImage("team-timo.jpg") setzen.
 * Empfohlene Größe: 400×500px
 */
export const TEAM_TIMO = publicImage("team-timo.svg");

/**
 * Porträtfoto Sarah.
 * Platzhalter liegt unter public/images/team-sarah.svg.
 * Echtes Bild: public/images/team-sarah.jpg ablegen → Wert auf publicImage("team-sarah.jpg") setzen.
 * Empfohlene Größe: 400×500px
 */
export const TEAM_SARAH = publicImage("team-sarah.svg");

// ─── Immobilien ──────────────────────────────────────────────────────────────

/**
 * Platzhalterbild für Immobilien ohne eigenes Foto.
 * Liegt unter public/images/property-placeholder.svg.
 */
export const PROPERTY_PLACEHOLDER = publicImage("property-placeholder.svg");
