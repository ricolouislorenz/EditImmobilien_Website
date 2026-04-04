import { Button } from "./ui/button";
import { Menu, X, Instagram } from "lucide-react";
import { useState } from "react";
import { LOGO } from "@/lib/assets";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#111111]/95 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection("home")}>
            <img src={LOGO} alt="Edit Immobilien" className="h-14 w-auto bg-white rounded px-2 py-1" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("leistungen")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors">
              Leistungen
            </button>
            <button onClick={() => scrollToSection("immobilien")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors">
              Immobilien
            </button>
            <button onClick={() => scrollToSection("uber-uns")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors">
              Über uns
            </button>
            <button onClick={() => scrollToSection("ratgeber")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors">
              Ratgeber
            </button>
            <button onClick={() => scrollToSection("kontakt")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors">
              Kontakt
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.instagram.com/edit_immobilien/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#C2A878] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <Button onClick={() => scrollToSection("kontakt")}>
              Termin vereinbaren
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-4 mt-4 pb-4">
            <button onClick={() => scrollToSection("leistungen")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors text-left">
              Leistungen
            </button>
            <button onClick={() => scrollToSection("immobilien")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors text-left">
              Immobilien
            </button>
            <button onClick={() => scrollToSection("uber-uns")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors text-left">
              Über uns
            </button>
            <button onClick={() => scrollToSection("ratgeber")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors text-left">
              Ratgeber
            </button>
            <button onClick={() => scrollToSection("kontakt")} className="text-gray-300 hover:text-[#6B4F3A] transition-colors text-left">
              Kontakt
            </button>
            <Button onClick={() => scrollToSection("kontakt")} className="w-full">
              Termin vereinbaren
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}