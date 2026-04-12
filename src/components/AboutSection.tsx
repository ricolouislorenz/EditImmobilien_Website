import { TEAM_TIMO, TEAM_SARAH } from "@/lib/assets";

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
          <div className="flex flex-col gap-6 mb-10">
            {/* Wer wir sind – Timo: Bild links, Text rechts */}
            <div className="flex flex-row items-center gap-6">
              <img
                src={TEAM_TIMO}
                alt="Timo – Edit Immobilien"
                className="rounded-lg transition-transform duration-500 hover:scale-105"
                style={{ width: '160px', height: '160px', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
              />
              <div>
                <h3 className="text-[#C2A878] mb-3">Wer wir sind</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Wir sind ein junges, engagiertes Immobilienteam, das seit unserer Gründung im Jahr 2016 den Markt mit frischen Ansätzen und neuen Ideen prägen möchte. Unsere Vision ist ein fairer Immobilienmarkt, der Verkäufer und Käufer gleichermaßen wertschätzt und deren Bedürfnisse in Einklang bringt.
                </p>
              </div>
            </div>

            {/* Unsere Expertise – Sarah: Text links, Bild rechts */}
            <div className="flex flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-[#C2A878] mb-3">Unsere Expertise</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Mit über 13 Jahren Erfahrung in der Immobilienbranche vereinen wir Fachwissen aus Bauprojektentwicklung, Hausverwaltung und Immobilienvermittlung. Diese Kombination aus langjähriger Expertise und innovativem Denken macht uns zu einem verlässlichen Partner für Ihre Immobilienprojekte.
                </p>
              </div>
              <img
                src={TEAM_SARAH}
                alt="Sarah – Edit Immobilien"
                className="rounded-lg transition-transform duration-500 hover:scale-105"
                style={{ width: '160px', height: '160px', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
              />
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
          </div>
        </div>
      </div>
    </section>
  );
}