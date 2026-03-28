import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie, Shield, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Datenschutz } from "./Datenschutz";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    setShowBanner(false);
    setShowSettings(false);
    
    // Here you would typically initialize analytics/marketing scripts based on consent
    if (prefs.analytics) {
      // Initialize Google Analytics or other analytics
      console.log("Analytics cookies enabled");
    }
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log("Marketing cookies enabled");
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-start gap-4 md:gap-6">
              {/* Cookie Icon */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-14 h-14 bg-[#808FA6]/10 rounded-full flex items-center justify-center border border-[#808FA6]/20">
                  <Cookie className="w-7 h-7 text-[#808FA6]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5 sm:hidden text-[#808FA6]" />
                  Wir respektieren Ihre Privatsphäre
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                  Notwendige Cookies sind für die Grundfunktionen erforderlich. Mit Ihrer Zustimmung 
                  können wir auch Analyse- und Marketing-Cookies verwenden, um unsere Website zu verbessern.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    size="lg"
                    className="bg-[#A2694A] hover:bg-[#8B5A3C] flex-1 sm:flex-none"
                  >
                    Alle akzeptieren
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 flex-1 sm:flex-none"
                  >
                    Nur notwendige
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    size="lg"
                    className="text-[#808FA6] hover:text-white hover:bg-white/5 gap-2 flex-1 sm:flex-none"
                  >
                    <Settings className="w-4 h-4" />
                    Einstellungen
                  </Button>
                </div>

                {/* Privacy Policy Link */}
                <p className="text-gray-500 text-sm mt-4">
                  Weitere Informationen finden Sie in unserer{" "}
                  <Datenschutz>
                    <button className="text-[#808FA6] hover:text-[#A2694A] underline">
                      Datenschutzerklärung
                    </button>
                  </Datenschutz>
                </p>
              </div>

              {/* Close Button (optional - only reject necessary) */}
              <button
                onClick={acceptNecessary}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#808FA6]" />
              Cookie-Einstellungen
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Verwalten Sie Ihre Cookie-Präferenzen. Sie können Ihre Einstellungen jederzeit ändern.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-white cursor-pointer">
                    Notwendige Cookies
                  </Label>
                  <span className="text-xs bg-[#808FA6]/20 text-[#808FA6] px-2 py-1 rounded">
                    Immer aktiv
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Diese Cookies sind für die Grundfunktionen der Website erforderlich und können 
                  nicht deaktiviert werden. Sie speichern z.B. Ihre Cookie-Einstellungen.
                </p>
              </div>
              <Switch
                checked={preferences.necessary}
                disabled
                className="mt-1"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
              <div className="flex-1">
                <Label htmlFor="analytics" className="text-white cursor-pointer mb-2 block">
                  Analyse-Cookies
                </Label>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                  indem sie Informationen anonym sammeln und melden.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
                className="mt-1"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
              <div className="flex-1">
                <Label htmlFor="marketing" className="text-white cursor-pointer mb-2 block">
                  Marketing-Cookies
                </Label>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Diese Cookies werden verwendet, um Besuchern auf Webseiten zu folgen und 
                  relevante Anzeigen zu schalten, die für sie interessant sein könnten.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={saveCustomPreferences}
              size="lg"
              className="bg-[#A2694A] hover:bg-[#8B5A3C] flex-1"
            >
              Auswahl speichern
            </Button>
            <Button
              onClick={acceptAll}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 flex-1"
            >
              Alle akzeptieren
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}