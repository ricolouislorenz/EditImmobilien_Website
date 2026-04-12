import { useState } from "react";
import { Mail, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { generateHausverkaufChecklistePDF } from "./HausverkaufCheckliste";
import { generateWertsteigerungRenovierungPDF } from "./WertsteigerungRenovierung";
import { generateHaeufigsteFehlerPDF } from "./HaeufigsteFehler";

interface DownloadItem {
  title: string;
  description: string;
  icon: string;
  filename: string;
  hasRealPDF?: boolean;
}

const downloads: DownloadItem[] = [
  {
    title: "Checkliste: Haus verkaufen in 10 Schritten",
    description: "Der komplette Leitfaden vom ersten Gedanken bis zum erfolgreichen Verkauf. Mit Zeitplan und Tipps vom Profi.",
    icon: "📋",
    filename: "checkliste-hausverkauf.pdf",
    hasRealPDF: true,
  },
  {
    title: "Guide: Wertsteigerung durch Renovierung",
    description: "Erfahren Sie, welche Renovierungen sich wirklich lohnen und wie Sie den Wert Ihrer Immobilie optimal steigern.",
    icon: "🔨",
    filename: "guide-wertsteigerung.pdf",
    hasRealPDF: true,
  },
  {
    title: "Die 7 häufigsten Fehler beim Immobilienverkauf",
    description: "Vermeiden Sie teure Fehler! Diese Checkliste zeigt Ihnen, worauf Sie unbedingt achten sollten.",
    icon: "⚠️",
    filename: "fehler-vermeiden.pdf",
    hasRealPDF: true,
  },
];

export function DownloadsSection() {
  const [selectedDownload, setSelectedDownload] = useState<DownloadItem | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToNewsletter, setAgreedToNewsletter] = useState(false);

  const handleDownloadClick = (download: DownloadItem) => {
    setSelectedDownload(download);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production, this would save to database
    setTimeout(() => {
      // Generate actual PDF if available
      if (selectedDownload?.hasRealPDF && selectedDownload.filename === "checkliste-hausverkauf.pdf") {
        try {
          generateHausverkaufChecklistePDF();
          toast.success("PDF wurde heruntergeladen!", {
            description: "Vielen Dank! Wir haben Ihnen den Download-Link auch per E-Mail zugeschickt.",
          });
        } catch (error) {
          console.error("PDF generation error:", error);
          toast.error("Fehler beim Generieren der PDF. Bitte versuchen Sie es erneut.");
        }
      } else if (selectedDownload?.hasRealPDF && selectedDownload.filename === "guide-wertsteigerung.pdf") {
        try {
          generateWertsteigerungRenovierungPDF();
          toast.success("PDF wurde heruntergeladen!", {
            description: "Vielen Dank! Wir haben Ihnen den Download-Link auch per E-Mail zugeschickt.",
          });
        } catch (error) {
          console.error("PDF generation error:", error);
          toast.error("Fehler beim Generieren der PDF. Bitte versuchen Sie es erneut.");
        }
      } else if (selectedDownload?.hasRealPDF && selectedDownload.filename === "fehler-vermeiden.pdf") {
        try {
          generateHaeufigsteFehlerPDF();
          toast.success("PDF wurde heruntergeladen!", {
            description: "Vielen Dank! Wir haben Ihnen den Download-Link auch per E-Mail zugeschickt.",
          });
        } catch (error) {
          console.error("PDF generation error:", error);
          toast.error("Fehler beim Generieren der PDF. Bitte versuchen Sie es erneut.");
        }
      } else {
        toast.success(`Download gestartet! ${selectedDownload?.title} wird heruntergeladen.`, {
          description: "Vielen Dank! Wir haben Ihnen den Download-Link auch per E-Mail zugeschickt.",
        });
      }
      
      // Reset form
      setEmail("");
      setName("");
      setAgreedToNewsletter(false);
      setSelectedDownload(null);
      setIsSubmitting(false);

      // In production, this would save to database
      console.log("Download requested:", {
        name,
        email,
        download: selectedDownload?.filename,
        newsletter: agreedToNewsletter,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <section id="ratgeber" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">

          <h2 className="text-white mb-4">
            Wertvolles Wissen für Ihren Immobilienverkauf
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
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
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                  {download.description}
                </p>

                {/* Button */}
                <Button
                  onClick={() => handleDownloadClick(download)}
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
      <Dialog open={!!selectedDownload} onOpenChange={() => setSelectedDownload(null)}>
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
              />
              <p className="text-xs text-gray-500 mt-1">
                Wir senden Ihnen den Download-Link per E-Mail zu.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-[#C2A878]/10 p-4 rounded-lg">
              <input
                type="checkbox"
                id="newsletter"
                checked={agreedToNewsletter}
                onChange={(e) => setAgreedToNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#111111] text-[#6B4F3A] focus:ring-[#6B4F3A] focus:ring-offset-0"
              />
              <label htmlFor="newsletter" className="text-xs text-gray-300">
                Ich möchte gerne weitere wertvolle Tipps rund um den Immobilienverkauf per
                E-Mail erhalten (optional, jederzeit abbestellbar)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedDownload(null)}
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
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Download anfordern
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}