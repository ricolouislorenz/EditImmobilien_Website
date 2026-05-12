import { TEAM_TIMO, TEAM_SARAH } from "@/lib/assets";

const team: Array<{ name: string; photo: string; role: string; description: string }> = [
  {
    name: "Timo Mustermann",
    photo: TEAM_TIMO,
    role: "Immobilienmakler",
    description:
      "Über 10 Jahre Erfahrung in der Vermittlung von Wohnimmobilien in Hamburg und Umgebung.",
  },
  {
    name: "Sarah Mustermann",
    photo: TEAM_SARAH,
    role: "Immobilienmaklerin",
    description:
      "Über 10 Jahre Erfahrung in der Vermittlung von Wohnimmobilien in Hamburg und Umgebung.",
  },
];

const values = [
  {
    title: "Begeistern",
    description:
      "Wir verknüpfen 'lose Enden' und schaffen vertrauensvolle Beziehungen durch qualifizierte, bedarfsgerechte Betreuung von Verkäufer und Käufer. Mit unserem umfassenden Netzwerk bringen wir Ihre Wünsche mit den passenden Handwerkern zusammen.",
  },
  {
    title: "Verändern",
    description:
      "Wir möchten den Immobilienmarkt nachhaltig verändern. Mit Professionalität und Empathie bringen wir die oft unterschiedlichen Bedürfnisse beider Seiten in Einklang und schaffen so Lösungen, die Vertrauen und Zufriedenheit fördern.",
  },
  {
    title: "Emotionen wecken",
    description:
      "Immobilien sind viel mehr als Zahlen, Daten, Fakten und eine Anhäufung von Steinen. Sie sind Orte der Träume, größer Entscheidungen und Lebensprojekte. Wir begleiten Sie auf diesem Weg mit Engagement und Fachwissen, um Ihre Vision Realität werden zu lassen.",
  },
];

export function AboutSection() {
  return (
    <section id="uber-uns" className="bg-[#111111] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-white">Wer wir sind</h2>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Intro */}
          <div className="mx-auto mb-16 flex max-w-3xl flex-col gap-6">
            <p className="text-base leading-relaxed text-gray-300">
              Wir sind ein junges, engagiertes Immobilienteam, das seit unserer Gründung im Jahr 2016 den Markt mit frischen Ansätzen und neuen Ideen prägen möchte. Unsere Vision ist ein fairer Immobilienmarkt, der Verkäufer und Käufer gleichermaßen wertschätzt und deren Bedürfnisse in Einklang bringt.
            </p>
            <p className="text-base leading-relaxed text-gray-300">
              Mit über 13 Jahren Erfahrung in der Immobilienbranche vereinen wir Fachwissen aus Bauprojektentwicklung, Hausverwaltung und Immobilienvermittlung. Diese Kombination aus langjähriger Expertise und innovativem Denken macht uns zu einem verlässlichen Partner für Ihre Immobilienprojekte.
            </p>
          </div>

          {/* Team */}
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h3 className="text-white">Die Menschen hinter Edit Immobilien</h3>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group flex flex-col items-center gap-5 rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#C2A878]/40 hover:shadow-[#C2A878]/15 sm:flex-row sm:items-start sm:p-6"
                  style={{ background: "linear-gradient(180deg, rgba(26,24,21,1) 0%, rgba(17,17,17,1) 100%)" }}
                >
                  <div className="aspect-square w-32 shrink-0 overflow-hidden rounded-xl border border-[#C2A878]/20 sm:w-36">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col text-center sm:text-left">
                    <p className="text-lg font-semibold text-white">{member.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-[#C2A878]">{member.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Werte */}
          <div>
            <div className="mb-8 text-center">
              <h3 className="text-white">Was uns antreibt</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C2A878]/40 hover:shadow-2xl hover:shadow-[#C2A878]/15"
                  style={{ background: "linear-gradient(145deg, rgba(30,27,24,0.98) 0%, rgba(18,16,14,1) 100%)" }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C2A878]/60 to-transparent"
                  />
                  <h4 className="mb-3 text-xl font-semibold text-white">{value.title}</h4>
                  <p className="text-base leading-relaxed text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
