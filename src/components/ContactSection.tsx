import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { TEAM_FOTO, TEAM_SARAH, TEAM_TIMO } from "@/lib/assets";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const contactPeople = [
  {
    name: "Timo",
    title: "Ihr Ansprechpartner",
    role: "Immobilienbewertung & Verkauf",
    image: TEAM_TIMO,
  },
  {
    name: "Sarah",
    title: "Ihre Ansprechpartnerin",
    role: "Beratung & Kundenbetreuung",
    image: TEAM_SARAH,
  },
];

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
    <section id="kontakt" className="bg-[#111111] py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-[#C2A878]">Kontakt</p>
            <h2 className="mb-4 text-white">Wir sind persönlich für Sie da</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
              Ob erste Frage, konkrete Verkaufsabsicht oder Wunsch nach einer Bewertung: Schreiben Sie uns
              oder buchen Sie direkt ein kostenloses Erstgespräch.
            </p>
          </div>

          <div
            className="mx-auto flex max-w-2xl flex-col overflow-hidden rounded-2xl sm:flex-row lg:mx-0"
            style={{
              background: "linear-gradient(135deg, rgba(107,79,58,0.35) 0%, rgba(60,44,32,0.3) 100%)",
              border: "1px solid rgba(194,168,120,0.25)",
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
              <div>
                <p className="mb-1.5 text-base font-semibold text-[#F6F2ED] sm:text-lg">
                  Kostenloses Erstgespräch buchen
                </p>
                <p className="text-sm text-gray-400">30 Minuten - bequem online, ohne Wartezeit</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => window.open("https://calendly.com/kontakt-edit-immobilien/30min", "_blank")}
                  className="px-6 font-semibold text-[#111111] transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #C2A878 0%, #b09060 100%)" }}
                >
                  Termin buchen
                </Button>
                <p className="text-xs text-gray-500">30 Minuten · kostenlos · unverbindlich</p>
              </div>
            </div>
            <img
              src={TEAM_FOTO}
              alt="Edit Immobilien Team"
              className="h-48 object-cover object-top sm:h-auto sm:w-48"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151311] p-6 shadow-2xl shadow-black/25 sm:p-8 lg:p-10"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(194,168,120,0.12), transparent 34%), linear-gradient(145deg, rgba(28,25,22,0.98) 0%, rgba(12,11,10,1) 100%)",
            }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C2A878]/50 to-transparent" />
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-[#C2A878]">Schreiben Sie uns</p>
                <h3 className="text-xl font-semibold text-[#F6F2ED]">Ihre Nachricht</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Wir antworten in der Regel innerhalb von 24 Stunden.
                </p>
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#C2A878]/25 bg-[#C2A878]/10 shadow-lg shadow-[#C2A878]/10 sm:flex">
                <Mail className="h-5 w-5 text-[#C2A878]" />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Field label="Name *" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Max Mustermann"
                  className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                />
              </Field>

              <Field label="Telefon" htmlFor="phone">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+49 123 456789"
                  className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="E-Mail *" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="max@beispiel.de"
                  className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Nachricht *" htmlFor="message">
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Wie können wir Ihnen helfen?"
                  className="resize-none rounded-xl border-white/10 bg-black/20 py-3 leading-relaxed text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                />
              </Field>
            </div>

            <Button
              type="submit"
              className="mt-7 h-12 w-full rounded-xl border border-[#C2A878]/20 bg-[#6B4F3A] font-medium text-white shadow-lg shadow-[#6B4F3A]/25 transition-all duration-200 hover:bg-[#5A4230] hover:shadow-[#6B4F3A]/35"
            >
              <Send className="mr-2 h-4 w-4" />
              Nachricht senden
            </Button>
          </form>

          <aside
            className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151311] p-6 shadow-2xl shadow-black/25 sm:p-8 lg:p-10"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(194,168,120,0.12), transparent 34%), linear-gradient(145deg, rgba(28,25,22,0.98) 0%, rgba(12,11,10,1) 100%)",
            }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C2A878]/50 to-transparent" />
            <div className="mb-7">
              <p className="mb-2 text-xs uppercase tracking-widest text-[#C2A878]">Ihre Ansprechpartner</p>
              <h3 className="text-xl font-semibold text-[#F6F2ED]">Direkt erreichbar</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Persönlich, verbindlich und ohne Umwege.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {contactPeople.map((person) => (
                <div
                  key={person.name}
                  className="group overflow-hidden rounded-xl border border-white/[0.08] bg-black/15 transition-all duration-200 hover:border-[#C2A878]/30 hover:bg-[#C2A878]/[0.06]"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={person.image}
                      alt={`${person.name} - Edit Immobilien`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-base font-semibold leading-none text-white">{person.name}</p>
                    <p className="mt-2 inline-flex rounded-full border border-[#C2A878]/25 bg-[#C2A878]/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#C2A878]">
                      {person.title}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-gray-400">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />

            <div className="grid gap-3">
              <ContactDetail
                icon={<Phone className="h-4 w-4" />}
                label="Telefon"
                href="tel:+4917290377547"
                text="+49 172 90 37 547"
              />
              <ContactDetail
                icon={<Mail className="h-4 w-4" />}
                label="E-Mail"
                href="mailto:kontakt@edit-immobilien.de"
                text="kontakt@edit-immobilien.de"
              />
              <ContactDetail
                icon={<Clock className="h-4 w-4" />}
                label="Öffnungszeiten"
                text="Mo - Fr 9:00 - 18:00 · Sa 10:00 - 14:00"
              />
              <ContactDetail
                icon={<MapPin className="h-4 w-4" />}
                label="Adresse"
                text="Hartwicusstr. 3 · 22087 Hamburg"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C2A878]/25 bg-[#C2A878]/10 text-[#C2A878] shadow-lg shadow-[#C2A878]/10">
      {children}
    </div>
  );
}

function ContactDetail({
  icon,
  label,
  href,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  text: string;
}) {
  const content = (
    <>
      <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-sm leading-relaxed text-[#F6F2ED]">{text}</p>
    </>
  );

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-black/15 p-3.5">
      <IconBox>{icon}</IconBox>
      {href ? (
        <a href={href} className="transition-colors hover:[&_p:last-child]:text-[#C2A878]">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
}
