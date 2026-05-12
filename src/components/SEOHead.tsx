import { useEffect } from 'react';

/**
 * Default-Meta-Tags der Seite liegen statisch in `index.html`, damit Crawler
 * sie ohne JS sehen. Diese Komponente überschreibt die Werte nur, wenn
 * explizit Props übergeben werden (z. B. später für Detailseiten).
 *
 * Wenn die Defaults der gesamten Seite geändert werden sollen → `index.html`
 * editieren, nicht hier.
 */
interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

function setMetaTag(name: string, content: string, isProperty = false): void {
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(url: string): void {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
}: SEOHeadProps) {
  useEffect(() => {
    if (title !== undefined) {
      document.title = title;
      setMetaTag('og:title', title, true);
      setMetaTag('twitter:title', title);
    }
    if (description !== undefined) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, true);
      setMetaTag('twitter:description', description);
    }
    if (keywords !== undefined) {
      setMetaTag('keywords', keywords);
    }
    if (ogImage !== undefined) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('twitter:image', ogImage);
    }
    if (canonicalUrl !== undefined) {
      setMetaTag('og:url', canonicalUrl, true);
      setCanonical(canonicalUrl);
    }
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}

/**
 * Strukturierte Daten (JSON-LD für RealEstateAgent / LocalBusiness / WebSite /
 * WebPage) liegen statisch in `index.html`, damit Crawler sie ohne
 * JS-Rendering sehen.
 *
 * Diese Komponente ist Platzhalter – falls später dynamische strukturierte
 * Daten nötig werden (z. B. für Immobilien-Detailseiten als `Product`/
 * `Offer`), kann sie hier ergänzt werden.
 */
export function StructuredData() {
  return null;
}
