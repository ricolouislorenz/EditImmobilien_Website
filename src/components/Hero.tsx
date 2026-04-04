import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HERO_BG } from "@/lib/assets";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openCalendly = () => {
    window.open("https://calendly.com/kontakt-edit-immobilien/30min", "_blank");
  };

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] flex items-center justify-center">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={HERO_BG}
          alt="Modernes Einfamilienhaus in Hamburg - Edit Immobilien vermittelt Traumhäuser in Hamburg, Wedel, Holm und Umgebung"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="max-w-3xl bg-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-10">
          <h1 className="text-white mb-6">
            Immobilienmakler Hamburg - Ihr Traumhaus in Hamburg & Umgebung
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Professionelle Immobilienvermittlung in Hamburg, Wedel, Holm & Norderstedt. Über 13 Jahre Erfahrung mit Spezialisierung auf Aufwertung & Wertsteigerung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={openCalendly} className="cursor-pointer bg-[#6B4F3A] hover:bg-[#5A4230]">
              Termin vereinbaren
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("immobilien")} className="cursor-pointer bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:border-white">
              Immobilien durchsuchen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}