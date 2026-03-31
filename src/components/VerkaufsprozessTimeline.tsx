import React, { useState, useEffect, useRef, type ReactNode } from "react";
import {
  FileText,
  Camera,
  TrendingUp,
  Users,
  MessageSquare,
  FileSignature,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

interface TimelineStep {
  icon: ReactNode;
  title: string;
  timeline: string;
  description: string;
  highlight?: boolean;
}

const steps: TimelineStep[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Kostenlose Bewertung & Unterlagen",
    timeline: "Tag 1-3",
    description:
      "Wir erstellen eine professionelle Bewertung Ihrer Immobilie und bereiten alle Unterlagen vom Grundriss bis zum Energieausweis auf.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Aufwertung & Wertsteigerung",
    timeline: "Tag 3-14",
    description:
      "Unser besonderer Service: Wir investieren bis zu 10% unserer Courtage in Renovierungen – kostenfrei für Sie. Ihre Immobilie wird optimal aufgewertet.",
    highlight: true,
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Professionelle Fotos & Exposé",
    timeline: "Tag 5-7",
    description:
      "Ausdrucksstarke Bilder durch erfahrene Fotografen. Wir setzen gezielte Akzente und erstellen ein individuelles Exposé.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Vermarktung & Platzierung",
    timeline: "Woche 2-6",
    description:
      "Ihr Objekt wird gezielt über alle relevanten Kanäle vermarktet und unserem Netzwerk kaufkräftiger Kunden zugänglich gemacht.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Einzelbesichtigungen",
    timeline: "Woche 3-8",
    description:
      "Persönlicher Kontakt statt Massenbesichtigungen. Wir finden durch gezielte Gespräche den idealen Käufer für Ihre Immobilie.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Verhandlung & Verkaufsgespräche",
    timeline: "Woche 6-10",
    description:
      "Wir übernehmen die gesamte Kommunikation zwischen Käufer und Verkäufer. Fair, transparent und mit dem Ziel einer Win-Win-Situation.",
  },
  {
    icon: <FileSignature className="w-6 h-6" />,
    title: "Notartermin & Vertragsabschluss",
    timeline: "Woche 8-12",
    description:
      "Wir begleiten Sie durch die letzten Schritte, unterstützen bei der Vertragsausfertigung und sind beim Notartermin an Ihrer Seite.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Service nach Verkauf",
    timeline: "Nach Abschluss",
    description:
      "Unser Service endet nicht mit dem Vertrag. Wir stehen Ihnen beim Besitzübergang und allen weiteren Fragen zur Seite.",
  },
];

export function VerkaufsprozessTimeline() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-[#111111] to-[#1a1a1a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C2A878]/10 px-4 py-2 rounded-full mb-4">
            <FileSignature className="w-5 h-5 text-[#C2A878]" />
            <span className="text-[#C2A878]">Ihr Weg zum Verkauf</span>
          </div>
          <h2 className="text-white mb-4">
            So läuft Ihr Hausverkauf ab
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vom ersten Gespräch bis zum Notartermin: Unser bewährter Prozess
            sorgt für einen reibungslosen und erfolgreichen Verkauf Ihrer Immobilie.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C2A878] via-[#6B4F3A] to-[#C2A878] opacity-30"></div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                className={`relative transition-all duration-700 ${
                  visibleSteps[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex flex-col md:flex-row gap-6 items-start ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline number/icon */}
                  <div className="flex-shrink-0 md:w-1/2 flex justify-start md:justify-end">
                    <div
                      className={`relative ${
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      } ml-0`}
                    >
                      {/* Circle with icon */}
                      <div
                        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                          step.highlight
                            ? "bg-gradient-to-br from-[#6B4F3A] to-[#5A4230]"
                            : "bg-gradient-to-br from-[#C2A878] to-[#6B7A8F]"
                        } shadow-xl`}
                      >
                        <div className="text-white">{step.icon}</div>
                      </div>

                      {/* Connecting dot */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#6B4F3A] opacity-20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-shrink-0 md:w-1/2 ml-20 md:ml-0">
                    <div
                      className={`${
                        step.highlight
                          ? "bg-gradient-to-br from-[#6B4F3A]/20 to-[#5A4230]/10 border-[#6B4F3A]/40"
                          : "bg-[#111111]/50 border-white/10"
                      } border rounded-xl p-6 hover:border-[#C2A878]/50 transition-all duration-300 hover:shadow-xl`}
                    >
                      {/* Timeline badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-3 ${
                          step.highlight
                            ? "bg-[#6B4F3A]/20 text-[#6B4F3A]"
                            : "bg-[#C2A878]/20 text-[#C2A878]"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        {step.timeline}
                      </div>

                      {/* Title */}
                      <h3 className="text-white mb-2 flex items-center gap-2">
                        {step.title}
                        {step.highlight && (
                          <Sparkles className="w-5 h-5 text-[#6B4F3A]" />
                        )}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 mb-4">
              Durchschnittliche Verkaufsdauer: <span className="text-[#6B4F3A]">8-12 Wochen</span>
            </p>
            <p className="text-sm text-gray-500">
              Jede Immobilie ist einzigartig. Wir passen den Prozess individuell an Ihre Bedürfnisse an.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}