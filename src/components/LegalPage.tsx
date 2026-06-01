import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LOGO } from "@/lib/assets";
import { ImpressumContent } from "./Impressum";
import { DatenschutzContent } from "./Datenschutz";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

/** Eigenständige, direkt verlinkbare Seite für die Rechtstexte. */
function LegalLayout({ title, children }: LegalLayoutProps) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} – Edit Immobilien`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 max-w-4xl py-4 flex items-center justify-between">
          <Link to="/" aria-label="Zur Startseite">
            <img src={LOGO} alt="Edit Immobilien" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-gray-400 hover:text-[#C2A878] transition-colors text-sm inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl py-12">
        <h1 className="text-3xl text-[#C2A878] mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <ImpressumContent />
    </LegalLayout>
  );
}

export function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <DatenschutzContent />
    </LegalLayout>
  );
}
