import { useEffect, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import { HERO_IMAGE } from "@/lib/assets";

function fadeUp(visible: boolean, delayMs: number): {
  className: string;
  style: CSSProperties;
} {
  return {
    className: "transition-all duration-700 ease-out",
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transitionDelay: `${delayMs}ms`,
      willChange: "opacity, transform",
    },
  };
}

export function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openCalendly = () => {
    window.open("https://calendly.com/kontakt-edit-immobilien/30min", "_blank");
  };

  const h1 = fadeUp(visible, 80);
  const lead = fadeUp(visible, 220);
  const buttons = fadeUp(visible, 360);
  const indicator = fadeUp(visible, 700);

  return (
    <section
      id="home"
      className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-ken-burns">
          <ImageWithFallback
            src={HERO_IMAGE.src}
            srcSet={HERO_IMAGE.srcSet}
            sizes="100vw"
            width={HERO_IMAGE.width}
            height={HERO_IMAGE.height}
            fetchPriority="high"
            decoding="async"
            alt="Modernes Einfamilienhaus in Hamburg - Edit Immobilien vermittelt Traumhäuser in Hamburg, Wedel, Holm und Umgebung"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-white">
        <div
          className="max-w-3xl backdrop-blur-sm rounded-2xl p-8 md:p-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.88)" }}
        >
          <h1 className={`text-white mb-6 ${h1.className}`} style={h1.style}>
            Ihr Traumhaus in Hamburg & Umgebung
          </h1>
          <p
            className={`text-xl md:text-2xl mb-8 text-gray-100 ${lead.className}`}
            style={lead.style}
          >
            Professionelle Immobilienvermittlung in Hamburg, Wedel, Holm & Norderstedt. Über 13 Jahre Erfahrung mit Spezialisierung auf Aufwertung & Wertsteigerung.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 ${buttons.className}`}
            style={buttons.style}
          >
            <Button
              size="lg"
              onClick={openCalendly}
              className="cursor-pointer bg-[#6B4F3A] hover:bg-[#5A4230]"
            >
              Termin vereinbaren
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("immobilien")}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:border-white"
            >
              Immobilien durchsuchen
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("wertrechner")}
        aria-label="Weiter zum Wertrechner"
        className={`group absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/85 transition-colors hover:text-[#C2A878] focus:outline-none focus-visible:text-[#C2A878] ${indicator.className}`}
        style={indicator.style}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">
            Mehr entdecken
          </span>
          <ChevronDown className="h-5 w-5 animate-scroll-bounce" />
        </div>
      </button>
    </section>
  );
}
