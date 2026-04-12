import { useEffect, useRef } from "react";

const steps = [
  {
    title: "Kostenlose Bewertung & Unterlagen",
    timeline: "Tag 1–3",
    description: "Professionelle Bewertung Ihrer Immobilie und Aufbereitung aller nötigen Unterlagen.",
  },
  {
    title: "Aufwertung & Wertsteigerung",
    timeline: "Tag 3–14",
    description: "Wir investieren bis zu 10 % unserer Courtage in Renovierungen – kostenfrei für Sie.",
  },
  {
    title: "Professionelle Fotos & Exposé",
    timeline: "Tag 5–7",
    description: "Ausdrucksstarke Bilder und ein individuelles Exposé, das Ihre Immobilie ins beste Licht rückt.",
  },
  {
    title: "Vermarktung & Platzierung",
    timeline: "Woche 2–6",
    description: "Gezielte Vermarktung über alle relevanten Kanäle und unser Netzwerk.",
  },
  {
    title: "Einzelbesichtigungen",
    timeline: "Woche 3–8",
    description: "Persönlicher Kontakt statt Massenbesichtigungen – wir finden den idealen Käufer.",
  },
  {
    title: "Verhandlung & Verkaufsgespräche",
    timeline: "Woche 6–10",
    description: "Wir übernehmen die gesamte Kommunikation – fair, transparent, zielorientiert.",
  },
  {
    title: "Notartermin & Vertragsabschluss",
    timeline: "Woche 8–12",
    description: "Wir begleiten Sie durch den Abschluss und sind beim Notartermin an Ihrer Seite.",
  },
  {
    title: "Service nach Verkauf",
    timeline: "Nach Abschluss",
    description: "Auch nach dem Vertrag stehen wir beim Besitzübergang und danach für Sie bereit.",
  },
];

const CARD_W = 240;
const CARD_H = 160;
const COL_GAP = 32;
const DOT_H = 40;

export function VerkaufsprozessTimeline() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    const setup = () => {
      // Track-Breite nach dem Render messen
      const trackW = track.scrollWidth;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Scroll-Raum: Track-Überhang + Pausen an beiden Enden (je 40vh)
      const overflow = Math.max(0, trackW - vw);
      const pause = vh * 0.4;
      outer.style.height = `${vh + overflow + pause * 2}px`;
    };

    const onScroll = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const trackW = track.scrollWidth;
      const overflow = Math.max(0, trackW - vw);
      const pause = vh * 0.4;

      const totalRange = outer.offsetHeight - vh;
      if (totalRange <= 0) return;

      const rawProgress = -outer.getBoundingClientRect().top / totalRange;
      const pauseFrac = pause / totalRange;
      const ratio = Math.max(0, Math.min(1,
        (rawProgress - pauseFrac) / (1 - pauseFrac * 2)
      ));

      track.style.transform = `translateX(${-ratio * overflow}px)`;
    };

    // Auf nächsten Frame warten, damit der Track korrekt gerendert ist
    const raf = requestAnimationFrame(() => {
      setup();
      onScroll();
    });

    window.addEventListener("resize", setup);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Padding links = halbe Viewport-Breite, damit erste Karte beim Start mittig steht
  // Padding rechts = gleich, damit letzte Karte am Ende mittig steht
  const padStyle = `calc((100vw - ${CARD_W}px) / 2)`;

  return (
    <div ref={outerRef}>
      {/* Sticky-Container mit explizitem Hintergrund – verhindert Durchscheinen */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#111111",
          display: "flex",
          flexDirection: "column",
          paddingTop: "73px", // Platz für den Header
        }}
      >
        {/* Titel */}
        <div style={{ textAlign: "center", padding: "1.5rem 1rem 0.25rem", flexShrink: 0 }}>
          <h2 className="text-white mb-1">So läuft Ihr Hausverkauf ab</h2>
          <p className="text-gray-500 text-sm">Scrollen Sie, um den Prozess zu erkunden →</p>
        </div>

        {/* Track-Bereich */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* Scrollender Track */}
          <div
            ref={trackRef}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              gap: `${COL_GAP}px`,
              paddingLeft: padStyle,
              paddingRight: padStyle,
              willChange: "transform",
              flexShrink: 0,
            }}
          >
            {/* Verbindungslinie von Punkt 1 bis Punkt 8 – im Track, bewegt sich mit */}
            <div style={{
              position: "absolute",
              top: `${CARD_H + DOT_H / 2}px`,
              left: `calc(${padStyle} + ${CARD_W / 2}px)`,
              width: `${(steps.length - 1) * (CARD_W + COL_GAP)}px`,
              height: "1px",
              backgroundColor: "rgba(194,168,120,0.4)",
              pointerEvents: "none",
            }} />

            {steps.map((step, i) => {
              const above = i % 2 === 0;
              return (
                <div
                  key={i}
                  style={{ width: `${CARD_W}px`, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  {/* Oberer Slot */}
                  <div style={{ height: `${CARD_H}px`, width: "100%", display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                    {above && <StepCard step={step} />}
                  </div>

                  {/* Punkt auf der Linie */}
                  <div style={{ height: `${DOT_H}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: "#C2A878",
                      }}
                    />
                  </div>

                  {/* Unterer Slot */}
                  <div style={{ height: `${CARD_H}px`, width: "100%", display: "flex", alignItems: "flex-start", paddingTop: "10px" }}>
                    {!above && <StepCard step={step} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function StepCard({ step }: { step: typeof steps[0] }) {
  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(30,28,26,0.95) 0%, rgba(20,18,16,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "1rem",
      }}
    >
      {/* Goldener Akzentstreifen oben */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "1rem",
        right: "1rem",
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(194,168,120,0.2), transparent)",
      }} />

      {/* Zeitangabe */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        marginBottom: "8px",
        alignSelf: "flex-start",
      }}>
        <div style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: "#C2A878",
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: "10px",
          color: "#C2A878",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}>
          {step.timeline}
        </span>
      </div>

      {/* Titel */}
      <h3 style={{
        color: "#F6F2ED",
        fontSize: "12px",
        fontWeight: 700,
        lineHeight: 1.35,
        marginBottom: "6px",
        letterSpacing: "0.01em",
      }}>
        {step.title}
      </h3>

      {/* Trennlinie */}
      <div style={{
        height: "1px",
        background: "rgba(255,255,255,0.06)",
        marginBottom: "8px",
      }} />

      {/* Beschreibung */}
      <p style={{
        color: "rgba(180,170,160,0.85)",
        fontSize: "11px",
        lineHeight: 1.6,
        flex: 1,
      }}>
        {step.description}
      </p>
    </div>
  );
}
