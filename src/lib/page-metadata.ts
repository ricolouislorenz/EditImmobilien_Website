export const SITE_URL = "https://edit-immobilien.de";
export const INDEX_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

/** ÜBERGABE SEO: Gemeinsame Texte für statischen Build und Navigation im Browser. */
export const PAGE_METADATA = {
  home: {
    path: "/",
    title: "Edit Immobilien | Immobilienmakler in Hamburg & Umgebung",
    description: "Immobilien in Hamburg, Wedel, Holm und Umgebung kaufen oder verkaufen. Persönliche Beratung, Immobilienbewertung und Unterstützung beim Verkauf.",
    robots: INDEX_ROBOTS,
  },
  impressum: {
    path: "/impressum",
    title: "Impressum | Edit Immobilien",
    description: "Anbieterkennzeichnung und Kontaktangaben von Edit Immobilien. Hier finden Sie die Angaben zum Betreiber dieser Website.",
    robots: INDEX_ROBOTS,
  },
  datenschutz: {
    path: "/datenschutz",
    title: "Datenschutz | Edit Immobilien",
    description: "Datenschutzhinweise von Edit Immobilien: Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Rechten auf dieser Website.",
    robots: INDEX_ROBOTS,
  },
  admin: {
    path: "/admin",
    title: "Admin | Edit Immobilien",
    description: "Geschützter Verwaltungsbereich von Edit Immobilien.",
    robots: "noindex, nofollow",
  },
};

export type PageMetadata = typeof PAGE_METADATA[keyof typeof PAGE_METADATA];

export function pageMetadataForPath(pathname: string): PageMetadata {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/impressum") return PAGE_METADATA.impressum;
  if (path === "/datenschutz") return PAGE_METADATA.datenschutz;
  if (path === "/admin" || path.startsWith("/admin/")) return PAGE_METADATA.admin;
  return PAGE_METADATA.home;
}

export function canonicalForPage(metadata: PageMetadata): string {
  return SITE_URL + metadata.path;
}

/** Vorhandene Firmendaten beibehalten, nur den Eintrag zur angezeigten Seite aktualisieren. */
export function pageStructuredData(graph: Record<string, unknown>, metadata: PageMetadata): Record<string, unknown> {
  return {
    ...graph,
    "@graph": Array.isArray(graph["@graph"]) ? graph["@graph"].map((entry) => entry["@type"] === "WebPage" ? {
      ...entry, "@id": canonicalForPage(metadata) + "#webpage", url: canonicalForPage(metadata),
      name: metadata.title, description: metadata.description,
    } : entry) : graph["@graph"],
  };
}
