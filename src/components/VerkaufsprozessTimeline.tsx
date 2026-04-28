import { useRef, useState } from "react";
import { Button } from "./ui/button";

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

const CARD_H = 160;

export function VerkaufsprozessTimeline() {
  const [isOpen, setIsOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const openTimeline = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="bg-[#111111] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-white">So läuft Ihr Hausverkauf ab</h2>
          <p className="mb-6 text-sm text-gray-500">
            Starten Sie den Prozess und scrollen Sie anschließend Schritt für Schritt nach unten.
          </p>
          {!isOpen && (
            <Button
              type="button"
              onClick={openTimeline}
              className="bg-[#6B4F3A] px-7 py-6 text-white hover:bg-[#5A4230]"
            >
              Verkaufsprozess anzeigen
            </Button>
          )}
        </div>

        {isOpen && (
          <div ref={timelineRef} className="relative mx-auto mt-14 max-w-5xl pt-2">
            <div className="absolute bottom-0 left-5 top-2 w-px bg-[#C2A878]/40 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-8 md:space-y-10">
              {steps.map((step, i) => {
                const rightSide = i % 2 === 0;

                return (
                  <div
                    key={step.title}
                    className="relative grid gap-4 pl-12 md:grid-cols-[1fr_40px_1fr] md:items-center md:gap-6 md:pl-0"
                  >
                    <div className={rightSide ? "md:col-start-3" : "md:col-start-1"}>
                      <StepCard step={step} />
                    </div>

                    <div className="absolute left-5 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:static md:col-start-2 md:row-start-1 md:flex md:translate-x-0 md:translate-y-0 md:justify-center">
                      <div className="h-3 w-3 rounded-full bg-[#C2A878] shadow-[0_0_0_6px_rgba(17,17,17,1)]" />
                    </div>

                    <div
                      className={
                        rightSide
                          ? "hidden md:col-start-1 md:row-start-1 md:block"
                          : "hidden md:col-start-3 md:row-start-1 md:block"
                      }
                    >
                      <div className="text-sm text-[#C2A878]/70">Schritt {i + 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StepCard({ step }: { step: typeof steps[0] }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        width: "100%",
        minHeight: `${CARD_H}px`,
        background: "linear-gradient(135deg, rgba(30,28,26,0.95) 0%, rgba(20,18,16,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "1rem",
          right: "1rem",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(194,168,120,0.2), transparent)",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "8px",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#C2A878",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "10px",
            color: "#C2A878",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          {step.timeline}
        </span>
      </div>

      <h3
        style={{
          color: "#F6F2ED",
          fontSize: "12px",
          fontWeight: 700,
          lineHeight: 1.35,
          marginBottom: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {step.title}
      </h3>

      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          marginBottom: "8px",
        }}
      />

      <p
        style={{
          color: "rgba(180,170,160,0.85)",
          fontSize: "11px",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {step.description}
      </p>
    </div>
  );
}
