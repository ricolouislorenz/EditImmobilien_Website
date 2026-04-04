import { Award, Users, TrendingUp } from "lucide-react";
import { TEAM_TIMO, TEAM_SARAH } from "@/lib/assets";

const features = [
  {
    icon: Award,
    title: "Begeistern",
    description: "Wir verknüpfen 'lose Enden' und schaffen vertrauensvolle Beziehungen durch qualifizierte, bedarfsgerechte Betreuung von Verkäufer und Käufer. Mit unserem umfassenden Netzwerk bringen wir Ihre Wünsche mit den passenden Handwerkern zusammen",
  },
  {
    icon: Users,
    title: "Verändern",
    description: "Wir möchten den Immobilienmarkt nachhaltig verändern. Mit Professionalität und Empathie bringen wir die oft unterschiedlichen Bedürfnisse beider Seiten in Einklang und schaffen so Lösungen, die Vertrauen und Zufriedenheit fördern",
  },
  {
    icon: TrendingUp,
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
          <p className="text-gray-400 max-w-3xl mx-auto italic">
            Begeistern - Verändern - Emotionen wecken
          </p>
        </div>

        {/* Kompakter Text ohne Bild */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Wer wir sind – Timo */}
            <div className="rounded-xl overflow-hidden border border-white/10 hover:border-[#C2A878]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#C2A878]/10 bg-[#1a1a1a]">
              <div className="h-56 overflow-hidden">
                <img
                  src={TEAM_TIMO}
                  alt="Timo – Edit Immobilien"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[#C2A878] mb-3">Wer wir sind</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Wir sind ein junges, engagiertes Immobilienteam, das seit unserer Gründung im Jahr 2016 den Markt mit frischen Ansätzen und neuen Ideen prägen möchte. Unsere Vision ist ein fairer Immobilienmarkt, der Verkäufer und Käufer gleichermaßen wertschätzt und deren Bedürfnisse in Einklang bringt.
                </p>
              </div>
            </div>

            {/* Unsere Expertise – Sarah */}
            <div className="rounded-xl overflow-hidden border border-white/10 hover:border-[#C2A878]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#C2A878]/10 bg-[#1a1a1a]">
              <div className="h-56 overflow-hidden">
                <img
                  src={TEAM_SARAH}
                  alt="Sarah – Edit Immobilien"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[#C2A878] mb-3">Unsere Expertise</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Mit über 13 Jahren Erfahrung in der Immobilienbranche vereinen wir Fachwissen aus Bauprojektentwicklung, Hausverwaltung und Immobilienvermittlung. Diese Kombination aus langjähriger Expertise und innovativem Denken macht uns zu einem verlässlichen Partner für Ihre Immobilienprojekte.
                </p>
              </div>
            </div>
          </div>

          {/* Kompakte Werte */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-center text-[#C2A878] mb-6">Unsere Werte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-[#111111] p-6 rounded-xl border-2 border-white/10 hover:border-[#C2A878] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C2A878]/20">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-[#C2A878]/10 rounded-full flex items-center justify-center border-2 border-[#C2A878]/20">
                      <feature.icon className="w-6 h-6 text-[#6B4F3A]" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-center text-[#C2A878]">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}