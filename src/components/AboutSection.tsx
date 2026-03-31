import { Award, Users, TrendingUp } from "lucide-react";
import { ABOUT_TEAM_IMAGE } from "@/lib/assets";

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
            <div className="bg-[#111111] p-6 rounded-xl border-2 border-white/10 hover:border-[#C2A878] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C2A878]/20">
              <h3 className="text-[#C2A878] mb-3">Wer wir sind</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Wir sind ein junges, engagiertes Immobilienteam, das seit unserer Gründung im Jahr 2016 den Markt mit frischen Ansätzen und neuen Ideen prägen möchte. Unsere Vision ist ein fairer Immobilienmarkt, der Verkäufer und Käufer gleichermaßen wertschätzt und deren Bedürfnisse in Einklang bringt.
              </p>
            </div>
            <div className="bg-[#111111] p-6 rounded-xl border-2 border-white/10 hover:border-[#C2A878] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C2A878]/20">
              <h3 className="text-[#C2A878] mb-3">Unsere Expertise</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Mit über 13 Jahren Erfahrung in der Immobilienbranche vereinen wir Fachwissen aus Bauprojektentwicklung, Hausverwaltung und Immobilienvermittlung. Diese Kombination aus langjähriger Expertise und innovativem Denken macht uns zu einem verlässlichen Partner für Ihre Immobilienprojekte.
              </p>
            </div>
          </div>

          {/* Team Foto */}
          <div className="flex justify-center mb-10">
            <div className="relative group max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C2A878] to-[#6B4F3A] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <img
                  src={ABOUT_TEAM_IMAGE}
                  alt="Edit Immobilien Team" 
                  className="w-full rounded-xl border-2 border-[#C2A878]/30 shadow-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl p-6">
                  <p className="text-white text-center italic">Ihr persönliches Team für faire Immobiliengeschäfte</p>
                </div>
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