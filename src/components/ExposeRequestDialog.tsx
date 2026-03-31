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

interface ExposeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle: string;
  propertyId: string;
}

export function ExposeRequestDialog({
  open,
  onOpenChange,
  propertyTitle,
  propertyId,
}: ExposeRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Flowfact Mini API Integration
      // Hier würde die echte Flowfact API-Anfrage erfolgen
      // Beispiel-Endpoint: POST /api/flowfact/request-expose
      
      /* 
      const response = await fetch('/api/flowfact/request-expose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: propertyId,
          customerData: formData,
        }),
      });

      if (!response.ok) throw new Error('Exposé-Anfrage fehlgeschlagen');
      
      const data = await response.json();
      */

      // Mock-Verzögerung für Demo
      await new Promise(resolve => setTimeout(resolve, 1500));

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

      // HINWEIS: Für die echte Flowfact Mini Integration benötigen Sie:
      // 1. Flowfact API-Credentials (API-Key, Secret)
      // 2. Backend-Endpoint (z.B. Supabase Edge Function)
      // 3. Flowfact API-Dokumentation für Exposé-Anfragen
      // Beispiel API-Call:
      // POST https://api.flowfact.com/expose/request
      // Headers: { Authorization: Bearer YOUR_API_KEY }
      // Body: { entityId: propertyId, contact: { name, email, phone } }

    } catch (error) {
      console.error("Fehler beim Anfordern des Exposés:", error);
      toast.error("Fehler bei der Anfrage", {
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
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
              disabled={loading}
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
