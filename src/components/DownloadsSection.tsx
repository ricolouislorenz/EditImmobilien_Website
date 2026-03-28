import { useState } from "react";
import { FileDown, CheckCircle2, Mail, Download, X } from "lucide-react";
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
    <section id="ratgeber" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#808FA6]/10 px-4 py-2 rounded-full mb-4">
            <FileDown className="w-5 h-5 text-[#808FA6]" />
            <span className="text-[#808FA6]">Kostenlose Ratgeber</span>
          </div>
          
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
              className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-[#808FA6]/50 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#808FA6] to-[#6B7A8F] rounded-lg flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {download.icon}
              </div>

              {/* Title */}
              <h3 className="text-white mb-3 text-lg">
                {download.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {download.description}
              </p>

              {/* Download Button */}
              <Button
                onClick={() => handleDownloadClick(download)}
                className="w-full bg-[#A2694A] hover:bg-[#8B5A3C] text-white transition-all duration-300 group-hover:shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Jetzt herunterladen
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#808FA6]/10 px-6 py-3 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-[#A2694A]" />
            <span className="text-gray-400 text-sm">
              100% kostenlos • Keine Verpflichtungen • Sofortiger Zugriff
            </span>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <Dialog open={!!selectedDownload} onOpenChange={() => setSelectedDownload(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <span className="text-3xl">{selectedDownload?.icon}</span>
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
                className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500 focus:border-[#808FA6]"
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
                className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500 focus:border-[#808FA6]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Wir senden Ihnen den Download-Link per E-Mail zu.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-[#808FA6]/10 p-4 rounded-lg">
              <input
                type="checkbox"
                id="newsletter"
                checked={agreedToNewsletter}
                onChange={(e) => setAgreedToNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#0a0a0a] text-[#A2694A] focus:ring-[#A2694A] focus:ring-offset-0"
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
                className="flex-1 bg-[#A2694A] hover:bg-[#8B5A3C] text-white"
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