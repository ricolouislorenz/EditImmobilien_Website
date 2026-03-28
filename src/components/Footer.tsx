import {
  Home,
  Instagram,
} from "lucide-react";
import { Impressum } from "./Impressum";
import { Datenschutz } from "./Datenschutz";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-white/10 text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-[#A2694A]" />
              <span className="text-white">
                EDIT Immobilien
              </span>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Ihr vertrauensvoller Immobilienmakler in Hamburg und Umgebung seit 2016. Spezialisiert auf Aufwertung & Wertsteigerung.
            </p>
            <address className="text-gray-400 not-italic text-sm space-y-1">
              <p className="text-[#808FA6]">Serviceregionen:</p>
              <p>Hamburg • Wedel • Holm</p>
              <p>Norderstedt • Quickborn • Pinneberg</p>
            </address>
          </div>

          <div>
            <h4 className="mb-4 text-[#808FA6]">Navigation</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#immobilien"
                    className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm"
                  >
                    Immobilien
                  </a>
                </li>
                <li>
                  <a
                    href="#uber-uns"
                    className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm"
                  >
                    Über uns
                  </a>
                </li>
                <li>
                  <a
                    href="#kontakt"
                    className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm"
                  >
                    Kontakt
                  </a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">
                  Immobilienverkauf
                </li>
                <li className="text-gray-400 text-sm">
                  Vermietung
                </li>
                <li className="text-gray-400 text-sm">
                  Bewertung
                </li>
                <li className="text-gray-400 text-sm">Wertsteigerung</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[#808FA6]">Folgen Sie uns</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.instagram.com/edit_immobilien/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#A2694A] hover:border-[#A2694A] transition-all"
                aria-label="Instagram - Edit Immobilien"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 EDIT Immobilien. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6">
              <Impressum>
                <button className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm">
                  Impressum
                </button>
              </Impressum>
              <Datenschutz>
                <button className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm">
                  Datenschutz
                </button>
              </Datenschutz>
              <a
                href="#"
                className="text-gray-400 hover:text-[#A2694A] transition-colors text-sm"
              >
                AGB
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}