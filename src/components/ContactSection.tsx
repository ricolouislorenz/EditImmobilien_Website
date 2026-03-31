import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const teamPhoto = "https://placehold.co/800x400?text=Team+Foto";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    toast.success("Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCalendly = () => {
    window.open("https://calendly.com/kontakt-edit-immobilien/30min", "_blank");
  };

  return (
    <section id="kontakt" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">Kontaktieren Sie uns</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Haben Sie Fragen oder möchten Sie einen Beratungstermin vereinbaren? 
            Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>

        {/* Calendly CTA Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-[#6B4F3A] to-[#5A4230] rounded-2xl p-8 md:p-10 text-center shadow-2xl">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white mb-3">
              Buchen Sie direkt einen Termin
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Nutzen Sie unseren Online-Kalender und vereinbaren Sie ganz bequem einen kostenlosen 
              Beratungstermin – wann es Ihnen am besten passt.
            </p>
            <Button
              size="lg"
              onClick={openCalendly}
              className="bg-white text-[#6B4F3A] hover:bg-gray-100 gap-2 shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Jetzt Termin buchen (30 Min.)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Max Mustermann"
                  className="bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 h-12"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">E-Mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="max@beispiel.de"
                  className="bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 h-12"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+49 123 456789"
                  className="bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 h-12"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <Label htmlFor="message" className="text-gray-300">Nachricht *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Ihre Nachricht an uns..."
                  className="bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 flex-1 leading-relaxed py-3"
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-auto">
                Nachricht senden
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            {/* Team Photo - Ihre Ansprechpartner */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              <img 
                src={teamPhoto} 
                alt="Edit Immobilien Team" 
                className="w-full h-auto"
              />
              <div className="p-6 bg-[#111111]">
                <h3 className="mb-2 text-[#C2A878]">Ihre Ansprechpartner</h3>
                <p className="text-gray-400 text-sm">
                  Wir sind persönlich für Sie da und begleiten Sie bei jedem Schritt Ihres Immobilienprojekts.
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-white">Kontaktinformationen</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#C2A878]/10 rounded-lg flex items-center justify-center border border-[#C2A878]/20">
                      <Phone className="w-5 h-5 text-[#C2A878]" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-300">Telefon</div>
                    <a href="tel:+4917290377547" className="text-[#6B4F3A] hover:underline">
                      +49 172 90 37 547
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#C2A878]/10 rounded-lg flex items-center justify-center border border-[#C2A878]/20">
                      <Mail className="w-5 h-5 text-[#C2A878]" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-300">E-Mail</div>
                    <a href="mailto:kontakt@edit-immobilien.de" className="text-[#6B4F3A] hover:underline break-all">
                      kontakt@edit-immobilien.de
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
              <h4 className="mb-4 text-[#C2A878]">Öffnungszeiten</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Montag - Freitag</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samstag</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}