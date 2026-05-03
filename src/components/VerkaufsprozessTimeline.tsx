const steps = [
  {
    title: "Kostenlose Bewertung & Unterlagen",
    timeline: "Tag 1-3",
    description: "Professionelle Bewertung Ihrer Immobilie und Aufbereitung aller nötigen Unterlagen.",
  },
  {
    title: "Aufwertung & Wertsteigerung",
    timeline: "Tag 3-14",
    description: "Wir investieren bis zu 10 % unserer Courtage in Renovierungen - kostenfrei für Sie.",
  },
  {
    title: "Professionelle Fotos & Exposé",
    timeline: "Tag 5-7",
    description: "Ausdrucksstarke Bilder und ein individuelles Exposé, das Ihre Immobilie ins beste Licht rückt.",
  },
  {
    title: "Vermarktung & Platzierung",
    timeline: "Woche 2-6",
    description: "Gezielte Vermarktung über alle relevanten Kanäle und unser Netzwerk.",
  },
  {
    title: "Einzelbesichtigungen",
    timeline: "Woche 3-8",
    description: "Persönlicher Kontakt statt Massenbesichtigungen - wir finden den idealen Käufer.",
  },
  {
    title: "Verhandlung & Verkaufsgespräche",
    timeline: "Woche 6-10",
    description: "Wir übernehmen die gesamte Kommunikation - fair, transparent, zielorientiert.",
  },
  {
    title: "Notartermin & Vertragsabschluss",
    timeline: "Woche 8-12",
    description: "Wir begleiten Sie durch den Abschluss und sind beim Notartermin an Ihrer Seite.",
  },
  {
    title: "Service nach Verkauf",
    timeline: "Nach Abschluss",
    description: "Auch nach dem Vertrag stehen wir beim Besitzübergang und danach für Sie bereit.",
  },
];

export function VerkaufsprozessTimeline() {
  return (
    <section className="bg-[#111111] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-white">So läuft Ihr Hausverkauf ab</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Ein klarer Ablauf vom ersten Gespräch bis zur Übergabe - kompakt, transparent und gut planbar.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl">
          <div className="absolute bottom-6 left-5 top-6 w-px bg-[#C2A878]/35 lg:left-1/2 lg:-translate-x-1/2" />

          <div className="space-y-5">
            {steps.map((step, index) => {
              const rightSide = index % 2 === 0;

              return (
                <div
                  key={step.title}
                  className="relative grid min-h-[104px] gap-4 pl-12 lg:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] lg:items-center lg:gap-0 lg:pl-0"
                >
                  <div className="absolute left-5 top-7 h-px w-7 bg-[#C2A878]/35 lg:hidden" />
                  <div
                    className={
                      rightSide
                        ? "hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:ml-2 lg:block lg:h-px lg:w-10 lg:-translate-y-1/2 lg:bg-[#C2A878]/35"
                        : "hidden lg:absolute lg:right-1/2 lg:top-1/2 lg:mr-2 lg:block lg:h-px lg:w-10 lg:-translate-y-1/2 lg:bg-[#C2A878]/35"
                    }
                  />

                  <div
                    className={
                      rightSide
                        ? "lg:col-start-3 lg:w-[25vw] lg:max-w-[320px] lg:justify-self-start lg:pl-8"
                        : "lg:col-start-1 lg:w-[25vw] lg:max-w-[320px] lg:justify-self-end lg:pr-8"
                    }
                  >
                    <StepCard step={step} stepNumber={index + 1} />
                  </div>

                  <div className="absolute left-5 top-7 z-10 -translate-x-1/2 -translate-y-1/2 lg:static lg:col-start-2 lg:row-start-1 lg:flex lg:translate-x-0 lg:translate-y-0 lg:justify-center">
                    <div className="h-3 w-3 rounded-full border-2 border-[#111111] bg-[#C2A878] shadow-[0_0_0_4px_rgba(17,17,17,1)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, stepNumber }: { step: typeof steps[0]; stepNumber: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#181818] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C2A878]/35 hover:bg-[#1C1A18] hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
      <div className="absolute bottom-4 left-0 top-4 w-0.5 bg-[#C2A878]/60" />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded border border-[#C2A878]/20 bg-[#C2A878]/10 px-2.5 py-1 text-[11px] font-medium text-[#C2A878]">
          Schritt {stepNumber}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#C2A878]/75">
          {step.timeline}
        </span>
      </div>

      <h3 className="mb-2 text-sm font-semibold leading-snug text-white">
        {step.title}
      </h3>

      <p className="text-xs leading-relaxed text-gray-400">
        {step.description}
      </p>
    </div>
  );
}
