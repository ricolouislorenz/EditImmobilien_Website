import { Home, TrendingUp, FileText, Calculator, Camera, Users, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState } from "react";

const services = [
  {
    icon: Home,
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
    <section id="leistungen" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">Unsere Leistungen als Immobilienmakler in Hamburg</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Als Ihr vertrauensvoller Immobilienmakler in Hamburg, Wedel, Holm und Norderstedt bieten wir Ihnen umfassende Dienstleistungen rund um Ihre Immobilie - von Verkauf über Vermietung bis zur professionellen Bewertung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="group bg-[#121212] p-8 rounded-xl border-2 border-white/10 hover:border-[#808FA6] transition-all duration-300 hover:shadow-2xl hover:shadow-[#808FA6]/20 cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-[#808FA6]/10 rounded-full flex items-center justify-center border-2 border-[#808FA6]/20 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-[#A2694A]" />
                </div>
              </div>
              <h3 className="mb-3 text-[#808FA6]">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
              <div className="mt-4 text-[#A2694A] group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center gap-1">
                Mehr erfahren →
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-[#808FA6]/20 to-[#A2694A]/20 rounded-xl p-6 border-2 border-[#808FA6]/30">
            <p className="text-gray-300">
              <span className="text-[#A2694A]">Kostenlose Erstberatung:</span> Vereinbaren Sie jetzt einen unverbindlichen Beratungstermin und lassen Sie uns über Ihre Immobilienziele sprechen.
            </p>
          </div>
        </div>
      </div>

      {/* Dialog for detailed information */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#121212] border-white/10">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#808FA6] to-[#808FA6]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <selectedService.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-[#808FA6]">{selectedService.title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedService.details.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-6">
                <p className="text-gray-300 mb-6">{selectedService.description}</p>
                
                <h4 className="mb-4 text-[#808FA6]">Was wir für Sie tun:</h4>
                <ul className="space-y-3">
                  {selectedService.details.content.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-300">
                      <span className="text-[#A2694A] mt-1 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-r from-[#808FA6]/20 to-[#A2694A]/20 rounded-lg border border-[#808FA6]/30">
                  <p className="text-gray-300">
                    <span className="text-[#A2694A]">Interessiert?</span> Kontaktieren Sie uns für ein persönliches Beratungsgespräch. Wir freuen uns darauf, Sie kennenzulernen!
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}