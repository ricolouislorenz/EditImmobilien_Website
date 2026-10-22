import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { sendExposeRequest } from "@/lib/email";
import { TurnstileCheck } from "./TurnstileCheck";

interface ExposeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle: string;
  /** Objektnummer der Immobilie, z. B. "EI-005" */
  propertyReference: string;
}

export function ExposeRequestDialog({
  open,
  onOpenChange,
  propertyTitle,
  propertyReference,
}: ExposeRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileRefresh, setTurnstileRefresh] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !turnstileToken) return;
    setLoading(true);

    try {
      await sendExposeRequest({
        turnstile_token: turnstileToken,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property_id: propertyReference,
        property_title: propertyTitle,
      });

      // ÜBERGABE BETRIEB-03: Erfolg bestätigt nur die Mailannahme durch Resend.
      // Das Exposé muss das Büro manuell versenden; ein automatischer Versand ist nicht implementiert.
      toast.success("Exposé-Anfrage erfolgreich!", {
        description: `Wir senden Ihnen das Exposé für "${propertyTitle}" per E-Mail zu.`,
      });

      // Formular zurücksetzen
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Fehler beim Anfordern des Exposés:", error);
      toast.error("Fehler bei der Anfrage", {
        description: error instanceof Error ? error.message : "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setTurnstileToken("");
      setTurnstileRefresh((value) => value + 1);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-[#111111] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-[#C2A878]" />
            <DialogTitle>Exposé anfordern</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Fordern Sie das vollständige Exposé für <span className="text-[#C2A878]">{propertyTitle}</span> an.
            Wir senden Ihnen alle Details per E-Mail zu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Ihr vollständiger Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#111111] border-white/10 focus:border-[#C2A878] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.de"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#111111] border-white/10 focus:border-[#C2A878] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+49 123 456789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-[#111111] border-white/10 focus:border-[#C2A878] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Nachricht (optional)</Label>
            <Textarea
              id="message"
              placeholder="Haben Sie Fragen zur Immobilie?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-[#111111] border-white/10 focus:border-[#C2A878] text-white min-h-20"
            />
          </div>
          {open && <TurnstileCheck action="expose_request" refreshKey={turnstileRefresh} onTokenChange={setTurnstileToken} />}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/10 hover:bg-white/5"
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={loading || !turnstileToken}
              className="flex-1 bg-[#C2A878] hover:bg-[#C2A878]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                "Exposé anfordern"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
