import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalForPage, pageMetadataForPath, pageStructuredData } from "@/lib/page-metadata";

function setMetaTag(name: string, content: string): void {
  const attribute = name.startsWith("og:") ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/** ÜBERGABE SEO: Bei jeder Navigation auch Beschreibung, Vorschautexte und Canonical zurücksetzen. */
export function SEOHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = pageMetadataForPath(pathname);
    document.title = metadata.title;
    for (const [name, content] of Object.entries({
      description: metadata.description, robots: metadata.robots,
      "og:title": metadata.title, "og:description": metadata.description, "og:url": canonicalForPage(metadata),
      "twitter:title": metadata.title, "twitter:description": metadata.description,
    })) setMetaTag(name, content);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalForPage(metadata));
    const structured = document.querySelector('script[type="application/ld+json"]');
    if (structured?.textContent && metadata.path !== "/admin") {
      try { structured.textContent = JSON.stringify(pageStructuredData(JSON.parse(structured.textContent), metadata)); }
      catch { /* Die gültige statische HTML-Vorlage bleibt maßgeblich. */ }
    }
  }, [pathname]);
  return null;
}
