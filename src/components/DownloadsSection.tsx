import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
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
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const submitting = useRef(false);

  // ÜBERGABE BETRIEB-04: Ein Klick lädt die PDF herunter, ohne persönliche Angaben.
  const handleDownloadClick = async (download: DownloadItem) => {
    if (submitting.current) return;
    submitting.current = true;
    setActiveDownload(download.filename);
    try {
      await generateDownloadPdf(download.filename);
      toast.success("PDF-Download gestartet!", { description: "Der Ratgeber wird direkt in Ihrem Browser heruntergeladen." });
    } catch {
      toast.error("Der Ratgeber konnte nicht erstellt werden. Bitte erneut versuchen.");
    } finally {
      submitting.current = false;
      setActiveDownload(null);
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
                  type="button"
                  disabled={activeDownload !== null}
                  aria-label={`${download.title} als PDF herunterladen`}
                  aria-busy={activeDownload === download.filename}
                  className="w-full text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#6B4F3A]/30"
                  style={{ background: "linear-gradient(135deg, #6B4F3A 0%, #5A4230 100%)", border: "1px solid rgba(194,168,120,0.2)" }}
                >
                  {activeDownload === download.filename ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  <span aria-live="polite">
                    {activeDownload === download.filename ? "PDF wird erstellt..." : "PDF herunterladen"}
                  </span>
                </Button>
              </div>

              {/* Goldener Akzentstreifen unten */}
              <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(194,168,120,0.15), transparent)" }} />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
