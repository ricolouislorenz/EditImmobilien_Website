import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export function SEOHead({
  title = "Edit Immobilien - Ihr Immobilienmakler in Hamburg & Umgebung | Holm, Wedel, Norderstedt",
  description = "Edit Immobilien - Professionelle Immobilienvermittlung in Hamburg, Wedel, Holm, Norderstedt & Umgebung. Spezialisiert auf Aufwertung & Wertsteigerung. Faire Kostenübernahme bei Renovierungen. ✓ Über 13 Jahre Erfahrung ✓ Persönliche Beratung",
  keywords = "Immobilienmakler Hamburg, Immobilien Hamburg, Haus verkaufen Hamburg, Immobilien Wedel, Immobilien Holm, Immobilien Norderstedt, Immobilienmakler Pinneberg, Einfamilienhaus Hamburg, Wertsteigerung Immobilien, Immobilienbewertung, Hausverwaltung Hamburg",
  ogImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop",
  canonicalUrl = "https://edit-immobilien.de"
}: SEOHeadProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'Edit Immobilien');
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('language', 'de');
    setMetaTag('revisit-after', '7 days');
    setMetaTag('theme-color', '#C2A878');

    // Open Graph Tags (Facebook, LinkedIn)
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:locale', 'de_DE', true);
    setMetaTag('og:site_name', 'Edit Immobilien', true);

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Geo Tags for Local SEO
    setMetaTag('geo.region', 'DE-HH');
    setMetaTag('geo.placename', 'Hamburg');
    setMetaTag('geo.position', '53.5511;9.9937');
    setMetaTag('ICBM', '53.5511, 9.9937');

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}

// Structured Data for Local Business & Real Estate Agent
export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RealEstateAgent",
          "@id": "https://edit-immobilien.de/#organization",
          "name": "Edit Immobilien",
          "url": "https://edit-immobilien.de",
          "logo": {
            "@type": "ImageObject",
            "url": "https://edit-immobilien.de/logo.png"
          },
          "description": "Professionelle Immobilienvermittlung in Hamburg und Umgebung mit Spezialisierung auf Aufwertung und Wertsteigerung von Immobilien.",
          "foundingDate": "2016",
          "slogan": "Begeistern - Verändern - Emotionen wecken",
          "areaServed": [
            {
              "@type": "City",
              "name": "Hamburg"
            },
            {
              "@type": "City",
              "name": "Wedel"
            },
            {
              "@type": "City",
              "name": "Holm"
            },
            {
              "@type": "City",
              "name": "Norderstedt"
            },
            {
              "@type": "City",
              "name": "Quickborn"
            },
            {
              "@type": "City",
              "name": "Halstenbek"
            },
            {
              "@type": "City",
              "name": "Pinneberg"
            }
          ],
          "knowsAbout": [
            "Immobilienvermittlung",
            "Immobilienbewertung",
            "Hausverwaltung",
            "Bauprojektentwicklung",
            "Wertsteigerung",
            "Renovierung"
          ],
          "priceRange": "€€€"
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://edit-immobilien.de/#localbusiness",
          "name": "Edit Immobilien",
          "image": "https://edit-immobilien.de/logo.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hamburg",
            "addressRegion": "HH",
            "addressCountry": "DE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "53.5511",
            "longitude": "9.9937"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            }
          ],
          "sameAs": [
            "https://edit-immobilien.de"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://edit-immobilien.de/#website",
          "url": "https://edit-immobilien.de",
          "name": "Edit Immobilien",
          "description": "Professionelle Immobilienvermittlung in Hamburg und Umgebung",
          "publisher": {
            "@id": "https://edit-immobilien.de/#organization"
          },
          "inLanguage": "de-DE"
        },
        {
          "@type": "WebPage",
          "@id": "https://edit-immobilien.de/#webpage",
          "url": "https://edit-immobilien.de",
          "name": "Edit Immobilien - Ihr Immobilienmakler in Hamburg & Umgebung",
          "isPartOf": {
            "@id": "https://edit-immobilien.de/#website"
          },
          "about": {
            "@id": "https://edit-immobilien.de/#organization"
          },
          "description": "Professionelle Immobilienvermittlung in Hamburg, Wedel, Holm, Norderstedt & Umgebung. Spezialisiert auf Aufwertung & Wertsteigerung.",
          "inLanguage": "de-DE"
        }
      ]
    };

    // Remove existing script if present
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}
