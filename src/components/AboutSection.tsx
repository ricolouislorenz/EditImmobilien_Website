import { TEAM_FOTO } from "@/lib/assets";
import { Button } from "./ui/button";

const CALENDLY_URL = "https://calendly.com/kontakt-edit-immobilien/30min";

const features = [
  {
    title: "Begeistern",
    description: "Wir verknüpfen 'lose Enden' und schaffen vertrauensvolle Beziehungen durch qualifizierte, bedarfsgerechte Betreuung von Verkäufer und Käufer. Mit unserem umfassenden Netzwerk bringen wir Ihre Wünsche mit den passenden Handwerkern zusammen",
  },
  {
    title: "Verändern",
    description: "Wir möchten den Immobilienmarkt nachhaltig verändern. Mit Professionalität und Empathie bringen wir die oft unterschiedlichen Bedürfnisse beider Seiten in Einklang und schaffen so Lösungen, die Vertrauen und Zufriedenheit fördern",
  },
  {
    title: "Emotionen wecken",
    description: "Immobilien sind viel mehr als Zahlen, Daten, Fakten und eine Anhäufung von Steinen. Sie sind Orte der Träume, größer Entscheidungen und Lebensprojekte. Wir begleiten Sie auf diesem Weg mit Engagement und Fachwissen, um Ihre Vision Realität werden zu lassen.",
  },
];

export function AboutSection() {
  return (
    <section id="uber-uns" className="py-16 bg-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="mb-3 text-white">Über uns</h2>
        </div>

        {/* Kompakter Text ohne Bild */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="mx-auto mb-12 flex max-w-3xl flex-col gap-10">
            <div>
              <h3 className="mb-4 text-[#C2A878]">Wer wir sind</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Wir sind ein junges, engagiertes Immobilienteam, das seit unserer Gründung im Jahr 2016 den Markt mit frischen Ansätzen und neuen Ideen prägen möchte. Unsere Vision ist ein fairer Immobilienmarkt, der Verkäufer und Käufer gleichermaßen wertschätzt und deren Bedürfnisse in Einklang bringt.
              </p>
            </div>

            <div className="border-t border-white/10 pt-10">
              <h3 className="mb-4 text-[#C2A878]">Unsere Expertise</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Mit über 13 Jahren Erfahrung in der Immobilienbranche vereinen wir Fachwissen aus Bauprojektentwicklung, Hausverwaltung und Immobilienvermittlung. Diese Kombination aus langjähriger Expertise und innovativem Denken macht uns zu einem verlässlichen Partner für Ihre Immobilienprojekte.
              </p>
            </div>
          </div>

          {/* Kompakte Werte */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-center text-[#C2A878] mb-6">Unsere Werte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border-2 border-white/10 hover:border-[#C2A878] hover:shadow-2xl hover:shadow-[#C2A878]/20"
                  style={{
                    background: "linear-gradient(145deg, rgba(30,27,24,0.98) 0%, rgba(18,16,14,1) 100%)",
                  }}
                >
                  {/* Goldener Akzentstreifen oben */}
                  <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(194,168,120,0.5), transparent)" }} />

                  <div className="flex flex-col p-6">
                    <h4 className="text-center mb-3" style={{ color: "#C2A878" }}>{feature.title}</h4>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "1rem" }} />
                    <p className="text-sm leading-relaxed text-center" style={{ color: "rgba(180,170,160,0.85)" }}>{feature.description}</p>
                  </div>

                  {/* Goldener Akzentstreifen unten */}
                  <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(194,168,120,0.15), transparent)" }} />
                </div>
              ))}
            </div>

            <div
              className="mx-auto mt-8 flex max-w-3xl flex-col overflow-hidden rounded-2xl sm:flex-row"
              style={{
                background: "linear-gradient(135deg, rgba(107,79,58,0.35) 0%, rgba(60,44,32,0.3) 100%)",
                border: "1px solid rgba(194,168,120,0.25)",
              }}
            >
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                <div>
                  <p className="mb-1.5 text-base font-semibold text-[#F6F2ED] sm:text-lg">
                    Kostenloses Erstgespräch buchen
                  </p>
                  <p className="text-sm text-gray-400">30 Minuten - bequem online, ohne Wartezeit</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    onClick={() => window.open(CALENDLY_URL, "_blank", "noopener,noreferrer")}
                    className="px-6 font-semibold text-[#111111] transition-all duration-200 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #C2A878 0%, #b09060 100%)" }}
                  >
                    Termin buchen
                  </Button>
                  <p className="text-xs text-gray-500">30 Minuten · kostenlos · unverbindlich</p>
                </div>
              </div>
              <img
                src={TEAM_FOTO}
                alt="Edit Immobilien Team"
                className="h-48 object-cover object-top sm:h-auto sm:w-48"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
