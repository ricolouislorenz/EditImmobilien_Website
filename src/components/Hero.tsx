import { Button } from "./ui/button";
import { Search, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzE2NDczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modernes Einfamilienhaus in Hamburg - Edit Immobilien vermittelt Traumhäuser in Hamburg, Wedel, Holm und Umgebung"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#808FA6]/90 to-[#808FA6]/50"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="max-w-3xl">
          <h1 className="text-white mb-6">
            Immobilienmakler Hamburg - Ihr Traumhaus in Hamburg & Umgebung
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Professionelle Immobilienvermittlung in Hamburg, Wedel, Holm & Norderstedt. Über 13 Jahre Erfahrung mit Spezialisierung auf Aufwertung & Wertsteigerung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={openCalendly} className="gap-2 bg-[#A2694A] hover:bg-[#8B5A3C]">
              <Calendar className="w-5 h-5" />
              Termin vereinbaren
            </Button>
            <Button size="lg" onClick={() => scrollToSection("immobilien")} className="gap-2" variant="outline">
              <Search className="w-5 h-5" />
              Immobilien durchsuchen
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("kontakt")} className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:border-white">
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}