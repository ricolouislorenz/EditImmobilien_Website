import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { generateDownloadPdf } from "@/lib/pdf-downloads";

interface DownloadItem {
  title: string;
  description: string;
  filename: string;
}

const downloads: DownloadItem[] = [
  {
    title: "Checkliste: Haus verkaufen in 10 Schritten",
    description: "Der komplette Leitfaden vom ersten Gedanken bis zum erfolgreichen Verkauf. Mit Zeitplan und Tipps vom Profi.",
    filename: "checkliste-hausverkauf.pdf",
  },
  {
    title: "Guide: Wertsteigerung durch Renovierung",
    description: "Erfahren Sie, welche Renovierungen sich wirklich lohnen und wie Sie den Wert Ihrer Immobilie optimal steigern.",
    filename: "guide-wertsteigerung.pdf",
  },
  {
    title: "Die 7 häufigsten Fehler beim Immobilienverkauf",
    description: "Vermeiden Sie teure Fehler! Diese Checkliste zeigt Ihnen, worauf Sie unbedingt achten sollten.",
    filename: "fehler-vermeiden.pdf",
  },
];

export function DownloadsSection() {
  const [selectedDownload, setSelectedDownload] = useState<DownloadItem | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  const handleDownloadClick = (download: DownloadItem) => {
    setSelectedDownload(download);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current || !selectedDownload) return;
    if (!email.trim() || !name.trim()) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    // ÜBERGABE BETRIEB-04: Direkter PDF-Download; E-Mail-/Newsletter-Anbindung fehlt.
    // Die Angaben bleiben lokal und werden weder versendet noch in der Konsole protokolliert.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);
    try {
      await generateDownloadPdf(selectedDownload.filename);
      toast.success("PDF-Download gestartet!", { description: "Der Ratgeber wird direkt in Ihrem Browser heruntergeladen." });
      setEmail("");
      setName("");
      setSelectedDownload(null);
    } catch {
      toast.error("Der Ratgeber konnte nicht erstellt werden. Bitte erneut versuchen.");
      // Bei Ladefehlern den Dialog und die Eingaben für einen erneuten Versuch erhalten.
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ratgeber" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">

          <h2 className="text-white mb-4">
            Wertvolles Wissen für Ihren Immobilienverkauf
          </h2>

          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            Laden Sie unsere kostenlosen Ratgeber herunter und profitieren Sie von unserer
            jahrelangen Erfahrung im Immobilienverkauf.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {downloads.map((download, index) => (
            <div
              key={index}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#C2A878]/10 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(30,27,24,0.98) 0%, rgba(18,16,14,1) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Goldener Akzentstreifen oben */}
              <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(194,168,120,0.5), transparent)" }} />

              <div className="flex flex-col flex-1 p-6">
                {/* Titel */}
                <h3 className="text-[#F6F2ED] mb-3 leading-snug" style={{ fontSize: "1rem", fontWeight: 700 }}>
                  {download.title}
                </h3>

                {/* Trennlinie */}
                <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* Beschreibung */}
                <p className="text-gray-300 text-base leading-relaxed flex-1 mb-6">
                  {download.description}
                </p>

                {/* Button */}
                <Button
                  onClick={() => handleDownloadClick(download)}
                  disabled={isSubmitting}
                  className="w-full text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#6B4F3A]/30"
                  style={{ background: "linear-gradient(135deg, #6B4F3A 0%, #5A4230 100%)", border: "1px solid rgba(194,168,120,0.2)" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Jetzt herunterladen
                </Button>
              </div>

              {/* Goldener Akzentstreifen unten */}
              <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(194,168,120,0.15), transparent)" }} />
            </div>
          ))}
        </div>

      </div>

      {/* Download Modal */}
      <Dialog open={!!selectedDownload} onOpenChange={(open) => { if (!open && !submitting.current) setSelectedDownload(null); }}>
        <DialogContent className="bg-[#1a1a1a] border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Download starten
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDownload?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="name" className="text-sm text-gray-300 mb-2 block">
                Ihr Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#111111] border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A878]"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-gray-300 mb-2 block">
                Ihre E-Mail-Adresse
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111111] border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A878]"
                required
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-400 mt-1">
                Der Download startet direkt im Browser. Ein Versand per E-Mail ist hier nicht eingerichtet.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-[#C2A878]/10 p-4 rounded-lg">
              <input
                type="checkbox"
                id="newsletter"
                checked={false}
                disabled
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#111111] text-[#6B4F3A] focus:ring-[#6B4F3A] focus:ring-offset-0"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-300">
                Eine Newsletter-Anmeldung ist derzeit nicht verfügbar.
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedDownload(null)}
                disabled={isSubmitting}
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/5"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#6B4F3A] hover:bg-[#5A4230] text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    PDF wird erstellt...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download anfordern
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-400 text-center">
              Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
