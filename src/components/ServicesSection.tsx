import { Home, TrendingUp, Calculator, Camera, Users, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

const services = [
  {
    icon: Home,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    title: "Immobilienverkauf",
    description: "Professionelle Vermarktung Ihrer Immobilie mit optimaler Preisgestaltung und gezielter Käuferansprache.",
    details: {
      subtitle: "Ihr Immobilienverkauf in besten Händen",
      content: [
        "Kostenlose Marktwertanalyse und realistische Preiseinschätzung",
        "Professionelle Immobilienfotografie und ansprechende Exposé-Erstellung",
        "Gezielte Vermarktung über alle relevanten Portale und unser Netzwerk",
        "Vorqualifizierung interessierter Käufer",
        "Organisation und Begleitung von Besichtigungsterminen",
        "Verhandlungsführung und Unterstützung bis zum Notartermin",
      ],
    },
  },
  {
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    title: "Immobilienvermietung",
    description: "Vermietungsservice von der Mietersuche bis zur Vertragsgestaltung - wir finden den passenden Mieter für Sie.",
    details: {
      subtitle: "Professionelle Vermietung Ihrer Immobilie",
      content: [
        "Ermittlung der optimalen Marktmiete",
        "Erstellung aussagekräftiger Mietanzeigen mit professionellen Fotos",
        "Bonitätsprüfung und Referenzprüfung potentieller Mieter",
        "Organisation von Besichtigungsterminen",
        "Erstellung rechtssicherer Mietverträge",
        "Wohnungsübergabe mit detailliertem Protokoll",
      ],
    },
  },
  {
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    title: "Immobilienbewertung",
    description: "Fundierte Wertermittlung Ihrer Immobilie basierend auf aktuellen Marktdaten und langjähriger Erfahrung.",
    details: {
      subtitle: "Ihre kostenlose Immobilienbewertung - professionell und zügig",
      content: [
        "Kostenlose Vor-Ort-Analyse Ihrer Immobilie",
        "Zügige Bearbeitung innerhalb weniger Tage",
        "Lage: Berücksichtigung von Infrastruktur, Verkehrsanbindung und Entwicklungspotenzial",
        "Zustand: Detaillierte Analyse von Bausubstanz, Modernisierungsbedarf und energetischer Beschaffenheit",
        "Ausstattung: Bewertung von Qualität, Alter und Besonderheiten der Ausstattung",
        "Marktsituation: Analyse aktueller Verkaufspreise vergleichbarer Objekte in Ihrer Region",
        "Ausführlicher Bewertungsbericht als Entscheidungsgrundlage",
        "Ihr verlässlicher Partner für eine realistische Werteinschätzung",
      ],
    },
  },
  {
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    title: "Aufwertung & Wertsteigerung",
    description: "Gemeinsam den Wert Ihrer Immobilie steigern - durch gezielte Renovierung, Sanierung und faire Kostenübernahme.",
    details: {
      subtitle: "Immobilien mit frischem Leben füllen",
      content: [
        "Stark vernetzt: Sie profitieren von unserem umfassenden Netzwerk mit zahlreichen Kontakten zum Handwerk",
        "Wertsteigerung durch individuelle Lösungen: Ob Renovierung oder Sanierung - wir rücken Ihre Immobilie ins beste Licht",
        "Faire Kostenübernahme: Wir beteiligen uns an den Renovierungskosten, um gemeinsam mit Ihnen den besten Preis zu erzielen",
        "Übernahme von bis zu 10% der Nettocourtage als Beitrag zu den Renovierungskosten",
        "Qualifizierter Alleinauftrag mit einer Laufzeit von mindestens 6 Monaten ab Vermarktungsstart",
        "Gemeinsame Planung der Renovierungsmaßnahmen, individuell an Ihre Bedürfnisse angepasst",
        "Maßgeschneiderte Lösungen für maximale Wertsteigerung und Verkaufserfolg",
      ],
    },
  },
  {
    icon: Camera,
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80",
    title: "Professionelle Vermarktung",
    description: "Hochwertige Fotos, virtuelle Rundgänge und ansprechende Exposés für maximale Aufmerksamkeit.",
    details: {
      subtitle: "Perfekte Präsentation Ihrer Immobilie",
      content: [
        "Professionelle Immobilienfotografie mit Weitwinkel und HDR",
        "360°-Rundgänge und virtuelle Besichtigungen",
        "Hochwertige Exposé-Erstellung mit allen relevanten Details",
        "Drohnenaufnahmen für besondere Objekte",
        "Social Media Marketing und Online-Präsenz",
        "Zielgruppengerechte Ansprache potentieller Interessenten",
      ],
    },
  },
  {
    icon: Users,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    title: "Persönliche Betreuung & Beratung",
    description: "Individuelle Begleitung und kompetente Anlageberatung - von der ersten Besichtigung bis zur erfolgreichen Investition.",
    details: {
      subtitle: "Ihr persönlicher Partner für Immobilien",
      content: [
        "Feste Ansprechpartner während des gesamten Prozesses",
        "Individuelle Beratung abgestimmt auf Ihre Bedürfnisse und Anlageziele",
        "Analyse Ihrer Investitionsziele und Auswahl geeigneter Objekte",
        "Renditeberechnung und Wirtschaftlichkeitsanalyse für Kapitalanleger",
        "Unterstützung bei der Finanzierungsplanung",
        "Transparente Kommunikation zu jedem Zeitpunkt",
        "Koordination aller Beteiligten (Notare, Banken, Handwerker)",
        "Langfristige Begleitung Ihrer Investition - auch nach dem Abschluss für Sie da",
      ],
    },
  },
];

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <section id="leistungen" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">Unsere Leistungen als Immobilienmakler in Hamburg</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Als Ihr vertrauensvoller Immobilienmakler in Hamburg, Wedel, Holm und Norderstedt bieten wir Ihnen umfassende Dienstleistungen rund um Ihre Immobilie - von Verkauf über Vermietung bis zur professionellen Bewertung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-lg flex flex-col border-2 border-white/10 hover:border-[#C2A878] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C2A878]/20"
              style={{ height: '380px' }}
            >
              {/* Bildbereich mit Farbfilter, Titel und Subtext */}
              <div className="relative flex-1 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Farbfilter */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: 'rgba(107,79,58,0.55)' }}
                />

                {/* Titelbalken oben links – nur so breit wie der Text */}
                <div className="absolute top-5 left-5 z-10">
                  <span
                    className="inline-block px-4 py-2 rounded text-white text-base font-bold leading-snug"
                    style={{ backgroundColor: '#111111' }}
                  >
                    {service.title}
                  </span>
                </div>

                {/* Subtext unten links auf dem Bild */}
                <div className="absolute left-8 right-12" style={{ bottom: '1.25rem' }}>
                  <p
                    className="text-white text-sm leading-relaxed line-clamp-3"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Unterer Balken – Footer-Grau */}
              <div
                className="relative z-10 px-5 py-3 flex items-center justify-center"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                <span className="text-[#C2A878] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                  Mehr erfahren →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-[#C2A878]/20 to-[#6B4F3A]/20 rounded-xl p-6 border-2 border-[#C2A878]/30">
            <p className="text-gray-300">
              <span className="text-[#6B4F3A]">Kostenlose Erstberatung:</span> Vereinbaren Sie jetzt einen unverbindlichen Beratungstermin und lassen Sie uns über Ihre Immobilienziele sprechen.
            </p>
          </div>
        </div>
      </div>

      {/* Dialog for detailed information */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#111111] border-white/10">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#C2A878] to-[#C2A878]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <selectedService.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-[#C2A878]">{selectedService.title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedService.details.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-6">
                <p className="text-gray-300 mb-6">{selectedService.description}</p>
                
                <h4 className="mb-4 text-[#C2A878]">Was wir für Sie tun:</h4>
                <ul className="space-y-3">
                  {selectedService.details.content.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-300">
                      <span className="text-[#6B4F3A] mt-1 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-r from-[#C2A878]/20 to-[#6B4F3A]/20 rounded-lg border border-[#C2A878]/30">
                  <p className="text-gray-300 mb-4">
                    <span className="text-[#6B4F3A]">Interessiert?</span> Kontaktieren Sie uns für ein persönliches Beratungsgespräch. Wir freuen uns darauf, Sie kennenzulernen!
                  </p>
                  <Button
                    className="bg-[#6B4F3A] hover:bg-[#5A4230] text-white cursor-pointer"
                    onClick={() => {
                      setSelectedService(null);
                      setTimeout(() => {
                        document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                      }, 150);
                    }}
                  >
                    Zum Kontaktformular
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}