import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TEAM_FOTO } from "@/lib/assets";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="kontakt" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-white mb-3">Kontakt</h2>
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Wir sind persönlich für Sie da – ob per Nachricht, Anruf oder direkt im Gespräch.
          </p>
        </div>

        {/* Calendly CTA */}
        <div
          className="rounded-2xl overflow-hidden flex flex-col sm:flex-row mb-10 mx-auto max-w-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(107,79,58,0.35) 0%, rgba(60,44,32,0.3) 100%)",
            border: "1px solid rgba(194,168,120,0.25)",
          }}
        >
          {/* Text + Button */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 p-8">
            <div>
              <p className="text-[#F6F2ED] font-semibold text-base sm:text-lg mb-1.5">
                Kostenloses Erstgespräch buchen
              </p>
              <p className="text-gray-400 text-sm">30 Minuten – bequem online, ohne Wartezeit</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={() => window.open("https://calendly.com/kontakt-edit-immobilien/30min", "_blank")}
                className="text-[#111111] font-semibold px-6 transition-all duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C2A878 0%, #b09060 100%)" }}
              >
                Termin buchen
              </Button>
              <p className="text-gray-500 text-xs">30 Minuten · kostenlos · unverbindlich</p>
            </div>
          </div>

          {/* Team-Foto – rechter Block */}
          <img
            src={TEAM_FOTO}
            alt="Edit Immobilien Team"
            className="sm:w-48 h-48 sm:h-auto object-cover object-top"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-gray-600 text-xs uppercase tracking-widest">oder schreiben Sie uns</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Form + Sidebar */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Formular */}
          <div
            className="rounded-2xl p-10 flex flex-col"
            style={{
              background: "linear-gradient(145deg, rgba(26,24,22,0.98) 0%, rgba(16,14,12,1) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Überschrift */}
            <h3 className="text-[#F6F2ED] text-lg font-semibold">Schreiben Sie uns</h3>
            <p className="text-gray-500 text-sm mt-1.5">Wir antworten in der Regel innerhalb von 24 Stunden.</p>

            {/* Felder */}
            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-500 text-xs uppercase tracking-widest">Name *</label>
                <Input
                  id="name" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="Max Mustermann"
                  className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-[#C2A878] focus:ring-0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-gray-500 text-xs uppercase tracking-widest">Telefon</label>
                <Input
                  id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                  placeholder="+49 123 456789"
                  className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-[#C2A878] focus:ring-0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <label htmlFor="email" className="text-gray-500 text-xs uppercase tracking-widest">E-Mail *</label>
              <Input
                id="email" name="email" type="email" value={formData.email} onChange={handleChange} required
                placeholder="max@beispiel.de"
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-[#C2A878] focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <label htmlFor="message" className="text-gray-500 text-xs uppercase tracking-widest">Nachricht *</label>
              <Textarea
                id="message" name="message" value={formData.message} onChange={handleChange} required
                rows={7} placeholder="Wie können wir Ihnen helfen?"
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-[#C2A878] focus:ring-0 resize-none py-3 leading-relaxed"
              />
            </div>

            <Button
              type="submit" onClick={handleSubmit}
              className="w-full h-11 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90 mt-8"
              style={{ background: "linear-gradient(135deg, #6B4F3A 0%, #5A4230 100%)", border: "1px solid rgba(194,168,120,0.2)" }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Nachricht senden
            </Button>
          </div>

          {/* Kontaktdaten */}
          <div
            className="rounded-2xl p-10 flex flex-col"
            style={{
              background: "linear-gradient(145deg, rgba(26,24,22,0.98) 0%, rgba(16,14,12,1) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Überschrift */}
            <h3 className="text-[#F6F2ED] text-lg font-semibold">Ihre Ansprechpartner</h3>
            <p className="text-gray-500 text-sm mt-1.5">Persönlich erreichbar – wir freuen uns auf Ihre Anfrage.</p>

            <div className="h-px bg-white/[0.06] mt-8" />

            {/* Kontaktmethoden */}
            <div className="flex flex-col gap-5 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(194,168,120,0.08)", border: "1px solid rgba(194,168,120,0.15)" }}>
                  <Phone className="w-4 h-4 text-[#C2A878]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Telefon</p>
                  <a href="tel:+4917290377547" className="text-[#F6F2ED] text-sm hover:text-[#C2A878] transition-colors">
                    +49 172 90 37 547
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(194,168,120,0.08)", border: "1px solid rgba(194,168,120,0.15)" }}>
                  <Mail className="w-4 h-4 text-[#C2A878]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">E-Mail</p>
                  <a href="mailto:kontakt@edit-immobilien.de" className="text-[#F6F2ED] text-sm hover:text-[#C2A878] transition-colors">
                    kontakt@edit-immobilien.de
                  </a>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/[0.06] mt-8" />

            {/* Öffnungszeiten */}
            <div className="flex items-start gap-4 mt-6">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(194,168,120,0.08)", border: "1px solid rgba(194,168,120,0.15)" }}>
                <Clock className="w-4 h-4 text-[#C2A878]" />
              </div>
              <div className="flex flex-col gap-3 text-sm w-full">
                <p className="text-gray-500 text-xs uppercase tracking-widest">Erreichbarkeit</p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mo – Fr</span>
                    <span className="text-[#F6F2ED]">9:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Samstag</span>
                    <span className="text-[#F6F2ED]">10:00 – 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sonntag</span>
                    <span className="text-gray-600">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
