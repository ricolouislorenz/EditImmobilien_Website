/**
 * Zentrale Verwaltung aller statischen Website-Assets.
 *
 * Bild hinzufügen:
 *   1. Datei in public/images/ ablegen (z. B. public/images/team.jpg)
 *   2. Hier als Konstante eintragen
 *   3. In der Komponente aus dieser Datei importieren – nie Pfade direkt im JSX
 *
 * Bild ersetzen (z. B. Logo):
 *   – Gleicher Dateiname → einfach Datei überschreiben, kein Code nötig
 *   – Anderer Dateiname → Pfad hier anpassen, Änderung wirkt überall
 */

// ─── Marke ───────────────────────────────────────────────────────────────────

/** Logo in der Navbar. Ersetzen: public/images/logo.svg überschreiben. */
export const LOGO = "/images/logo.svg";

// ─── Hero ────────────────────────────────────────────────────────────────────

/**
 * Hintergrundbild im Hero-Bereich.
 * Eigenes Bild: public/images/hero-bg.jpg ablegen und Pfad hier anpassen.
 */
export const HERO_BG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzE2NDczM3ww&ixlib=rb-4.1.0&q=80&w=1080";

// ─── About / Team ────────────────────────────────────────────────────────────

/**
 * Team-Foto in der Über-uns-Sektion.
 * Eigenes Bild: public/images/team.jpg ablegen und Wert auf "/images/team.jpg" setzen.
 */
export const ABOUT_TEAM_IMAGE = "https://placehold.co/800x600?text=Team+Foto";

// ─── Weitere Slots (auskommentiert bis Dateien vorliegen) ────────────────────

// export const TEAM_FOTO_PERSON_1 = "/images/team-max.jpg";
// export const TEAM_FOTO_PERSON_2 = "/images/team-anna.jpg";
// export const PARTNER_LOGO_1     = "/images/partner-sparkasse.svg";
