import { Fragment } from "react";

const steps = [
  {
    title: "Kostenlose Bewertung & Unterlagen",
    timeline: "Tag 1-3",
    description:
      "Professionelle Bewertung Ihrer Immobilie und Aufbereitung aller nötigen Unterlagen.",
  },
  {
    title: "Aufwertung & Wertsteigerung",
    timeline: "Tag 3-14",
    description:
      "Bis zu 10 % der Courtage fließen in Renovierungen – kostenfrei für Sie.",
  },
  {
    title: "Professionelle Fotos & Exposé",
    timeline: "Tag 5-7",
    description:
      "Ausdrucksstarke Bilder und ein individuelles Exposé für Ihre Immobilie.",
  },
  {
    title: "Vermarktung & Platzierung",
    timeline: "Woche 2-6",
    description:
      "Gezielte Vermarktung über alle relevanten Kanäle und unser Netzwerk.",
  },
  {
    title: "Einzelbesichtigungen",
    timeline: "Woche 3-8",
    description:
      "Persönlicher Kontakt statt Massenbesichtigungen – wir finden den idealen Käufer.",
  },
  {
    title: "Verhandlung & Verkaufsgespräche",
    timeline: "Woche 6-10",
    description:
      "Wir übernehmen die Kommunikation – fair, transparent, zielorientiert.",
  },
  {
    title: "Notartermin & Vertragsabschluss",
    timeline: "Woche 8-12",
    description:
      "Wir begleiten Sie durch den Abschluss und sind beim Notartermin an Ihrer Seite.",
  },
  {
    title: "Service nach Verkauf",
    timeline: "Nach Abschluss",
    description:
      "Beim Übergabetermin und danach stehen wir weiterhin für Sie bereit.",
  },
];

export function VerkaufsprozessTimeline() {
  return (
    <section className="bg-[#111111] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-white">So läuft Ihr Hausverkauf ab</h2>
          <p className="text-base leading-relaxed text-gray-300">
            Ein klarer Ablauf vom ersten Gespräch bis zur Übergabe – kompakt,
            transparent und gut planbar.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative w-[280px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#C2A878]"
            />

            <div className="relative">
              {steps.map((step, index) => (
                <Fragment key={step.title}>
                  <StepCard step={step} stepNumber={index + 1} />
                  {index < steps.length - 1 ? <StepDivider /> : null}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepDivider() {
  return <div aria-hidden="true" className="h-10" />;
}

function StepCard({
  step,
  stepNumber,
}: {
  step: (typeof steps)[number];
  stepNumber: number;
}) {
  return (
    <div className="relative block h-[190px] w-[280px] overflow-hidden rounded-lg border border-white/[0.08] bg-[#181818] p-4 transition-colors duration-200 hover:border-[#C2A878]/35">
      <div className="mb-3 flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-wider">
        <span className="text-[#C2A878]">Schritt {stepNumber}</span>
        <span className="text-gray-400">{step.timeline}</span>
      </div>
      <div className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-white">
        {step.title}
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-gray-300">
        {step.description}
      </p>
    </div>
  );
}
