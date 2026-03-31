import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ExternalLink } from "lucide-react";

interface ImpressumProps {
  children: React.ReactNode;
}

export function Impressum({ children }: ImpressumProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#C2A878]">Impressum</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-[#6B4F3A] mb-2">Angaben gemäß § 5 TMG</h3>
            <p>Timo-Maximilian Konrad</p>
            <p>Innehabende Person</p>
            <p>Hartwicusstr. 3</p>
            <p>22087 Hamburg</p>
          </section>

          <section>
            <h3 className="text-[#6B4F3A] mb-2">Kontakt</h3>
            <p>Telefon: <a href="tel:01729037547" className="text-[#C2A878] hover:underline">01729037547</a></p>
            <p>E-Mail: <a href="mailto:kontakt@edit-immobilien.de" className="text-[#C2A878] hover:underline">kontakt@edit-immobilien.de</a></p>
          </section>

          <section>
            <h3 className="text-[#6B4F3A] mb-2">Aufsichtsbehörde</h3>
            <p>Bezirksamt Hamburg Eimsbüttel</p>
            <p>Grindelberg 62-66, 20139 Hamburg</p>
            <a 
              href="https://www.hamburg.de/politik-und-verwaltung/bezirke/bezirksamt-eimsbuettel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C2A878] hover:underline inline-flex items-center gap-1 mt-2"
            >
              Website der Aufsichtsbehörde
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>

          <section>
            <h3 className="text-[#6B4F3A] mb-2">Berufsbezeichnung und berufsrechtliche Regelungen</h3>
            <p className="mb-2"><strong>Berufsbezeichnung:</strong></p>
            <p className="mb-4">Immobilienmakler</p>
            
            <p className="mb-2"><strong>Zuständige Kammer:</strong></p>
            <p className="mb-4">Industrie- und Handelskammer zu Kiel, Bergstraße 2, 24100 Kiel</p>
            
            <p className="mb-2"><strong>Verliehen in:</strong></p>
            <p>Deutschland</p>
          </section>

          <section>
            <h3 className="text-[#6B4F3A] mb-2">EU-Streitschlichtung</h3>
            <p className="mb-2">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <a 
              href="https://ec.europa.eu/consumers/odr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C2A878] hover:underline inline-flex items-center gap-1"
            >
              https://ec.europa.eu/consumers/odr/
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>

          <section>
            <h3 className="text-[#6B4F3A] mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="text-sm text-gray-500 pt-4 border-t border-white/10">
            <p>Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="hover:underline">e-recht24.de</a></p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
