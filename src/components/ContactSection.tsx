import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Home,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/email";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const CALENDLY_URL = "https://calendly.com/kontakt-edit-immobilien/30min";
const PHONE_HREF = "tel:+4917290377547";

type InquiryType = "offer" | "search" | "general";
type ContactMethod = "phone" | "appointment" | "email";
type WizardStep = "inquiry" | "method" | "details";

const inquiryOptions: Array<{
  id: InquiryType;
  title: string;
  icon: React.ReactNode;
}> = [
  {
    id: "offer",
    title: "Immobilie vermieten/verkaufen",
    icon: <Home className="h-7 w-7" />,
  },
  {
    id: "search",
    title: "Immobilie mieten/kaufen",
    icon: <Search className="h-7 w-7" />,
  },
  {
    id: "general",
    title: "Allgemeine Anfrage",
    icon: <MessageSquareText className="h-7 w-7" />,
  },
];

const methodOptions: Array<{
  id: ContactMethod;
  title: string;
  icon: React.ReactNode;
}> = [
  {
    id: "phone",
    title: "Jetzt anrufen",
    icon: <Phone className="h-7 w-7" />,
  },
  {
    id: "appointment",
    title: "Termin vereinbaren",
    icon: <CalendarDays className="h-7 w-7" />,
  },
  {
    id: "email",
    title: "Direkt schreiben",
    icon: <Mail className="h-7 w-7" />,
  },
];

const stepLabels: Record<WizardStep, string> = {
  inquiry: "Anliegen",
  method: "Kontaktweg",
  details: "Ihre Nachricht",
};

export function ContactSection() {
  const [step, setStep] = useState<WizardStep>("inquiry");
  const [formData, setFormData] = useState({
    inquiryType: "" as InquiryType | "",
    contactMethod: "" as ContactMethod | "",
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefilledInquiryTitle, setPrefilledInquiryTitle] = useState<string | null>(null);
  const wizardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const selectedInquiry = useMemo(
    () => inquiryOptions.find((option) => option.id === formData.inquiryType),
    [formData.inquiryType],
  );

  const effectiveInquiryTitle = prefilledInquiryTitle ?? selectedInquiry?.title ?? null;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (step === "details") {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ title?: string }>).detail;
      if (!detail?.title) return;
      setPrefilledInquiryTitle(detail.title);
      setFormData((current) => ({
        ...current,
        inquiryType: "",
        contactMethod: "",
      }));
      setStep("method");
    };
    window.addEventListener("edit-immobilien:select-service", handler);
    return () => window.removeEventListener("edit-immobilien:select-service", handler);
  }, []);

  const handleInquirySelect = (inquiryType: InquiryType) => {
    setFormData((current) => ({
      ...current,
      inquiryType,
      contactMethod: "",
    }));
    setStep("method");
  };

  const handleMethodSelect = (contactMethod: ContactMethod) => {
    setFormData((current) => ({ ...current, contactMethod }));

    if (contactMethod === "phone") {
      window.location.href = PHONE_HREF;
      toast.info("Der Anruf wird gestartet.");
      return;
    }

    if (contactMethod === "appointment") {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      toast.info("Das Terminfenster wurde geöffnet.");
      return;
    }

    if (contactMethod === "email") {
      setStep("details");
    }
  };

  const handleBack = () => {
    if (step === "method") {
      setPrefilledInquiryTitle(null);
      setStep("inquiry");
      return;
    }

    if (step === "details") {
      setStep("method");
    }
  };

  const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const userMessage = formData.message.trim();
    const message = [
      "Neue Kontaktanfrage über den Website-Assistenten",
      "",
      `Anliegen: ${effectiveInquiryTitle ?? "Allgemeine Anfrage"}`,
      "Gewünschter Kontaktweg: Direkt schreiben",
      "",
      "Nachricht:",
      userMessage,
    ].join("\n");

    try {
      await sendContactEmail({
        name,
        email: formData.email.trim(),
        phone: "",
        message,
      });
      toast.success("Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.");
      setFormData({
        inquiryType: "",
        contactMethod: "",
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
      setPrefilledInquiryTitle(null);
      setStep("inquiry");
    } catch (error) {
      console.error(error);
      toast.error("Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="bg-[#111111] py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">Wir sind persönlich für Sie da</h2>
          <p className="text-base leading-relaxed text-gray-300 max-w-2xl mx-auto">
            Wählen Sie kurz aus, worum es geht. Danach entscheiden Sie, ob Sie direkt anrufen,
            einen Termin buchen oder uns schreiben möchten.
          </p>
        </div>

        <div className="mx-auto max-w-4xl px-1 sm:px-0">
          <div
            ref={wizardRef}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-[#C2A878]/20 bg-[#1a1a1a] p-6 shadow-2xl shadow-black/25 sm:p-9 lg:p-12"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(194,168,120,0.12), transparent 34%), linear-gradient(145deg, rgba(30,27,24,0.98) 0%, rgba(18,16,14,1) 100%)",
            }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C2A878]/50 to-transparent" />
            <div className="mb-8 pb-2">
              <h3 className="text-xl font-semibold text-[#F6F2ED]">{stepLabels[step]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {effectiveInquiryTitle
                  ? `Ausgewählt: ${effectiveInquiryTitle}`
                  : "Starten Sie mit der Auswahl Ihres Anliegens."}
              </p>
            </div>

            <div className="flex flex-col">
              {step === "inquiry" && (
                <WizardPanel>
                  <OptionGrid>
                    {inquiryOptions.map((option) => (
                      <WizardOption
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        onClick={() => handleInquirySelect(option.id)}
                      />
                    ))}
                  </OptionGrid>
                </WizardPanel>
              )}

              {step === "method" && (
                <WizardPanel title="Wie möchten Sie Kontakt aufnehmen?">
                  <OptionGrid>
                    {methodOptions.map((option) => (
                      <WizardOption
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        onClick={() => handleMethodSelect(option.id)}
                      />
                    ))}
                  </OptionGrid>
                  <WizardFooter onBack={handleBack} />
                </WizardPanel>
              )}

              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="flex flex-col">
                  <WizardPanel
                    title="Schreiben Sie uns direkt"
                    description="Wir antworten Ihnen so schnell wie möglich per E-Mail."
                  >
                    <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-5 sm:p-6 md:p-7">
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <Field label="Vorname" htmlFor="firstName">
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={(event) =>
                                setFormData((current) => ({ ...current, firstName: event.target.value }))
                              }
                              required
                              placeholder="Max"
                              className="h-12 w-full rounded-xl border-white/10 bg-black/40 text-base text-white placeholder:text-gray-500 focus:border-[#C2A878] focus:ring-0"
                            />
                          </Field>
                          <Field label="Nachname" htmlFor="lastName">
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={(event) =>
                                setFormData((current) => ({ ...current, lastName: event.target.value }))
                              }
                              required
                              placeholder="Mustermann"
                              className="h-12 w-full rounded-xl border-white/10 bg-black/40 text-base text-white placeholder:text-gray-500 focus:border-[#C2A878] focus:ring-0"
                            />
                          </Field>
                        </div>

                        <Field label="E-Mail" htmlFor="email">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(event) =>
                              setFormData((current) => ({ ...current, email: event.target.value }))
                            }
                            required
                            placeholder="max@beispiel.de"
                            className="h-12 w-full rounded-xl border-white/10 bg-black/40 text-base text-white placeholder:text-gray-500 focus:border-[#C2A878] focus:ring-0"
                          />
                        </Field>

                        <Field label="Nachricht" htmlFor="message">
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={(event) =>
                              setFormData((current) => ({ ...current, message: event.target.value }))
                            }
                            required
                            minLength={10}
                            rows={6}
                            aria-describedby="message-hint"
                            placeholder="Schildern Sie uns kurz Ihre Situation, gewünschte Lage, Zeitrahmen ..."
                            className="min-h-[160px] w-full rounded-xl border-white/10 bg-black/40 text-base text-white placeholder:text-gray-500 focus:border-[#C2A878] focus:ring-0"
                          />
                          <p id="message-hint" className="text-xs text-gray-500">
                            Bitte mindestens 10 Zeichen.
                          </p>
                        </Field>
                      </div>
                    </div>
                    <WizardFooter
                      onBack={handleBack}
                      submitLabel={isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                      submitIcon={<Send className="h-4 w-4" />}
                      submitDisabled={isSubmitting}
                    />
                  </WizardPanel>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function WizardPanel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {(title || description) && (
        <div className="mb-6">
          {title && <h4 className="text-lg font-semibold text-white sm:text-xl">{title}</h4>}
          {description && (
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-300">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:gap-5 xl:gap-6">
      {children}
    </div>
  );
}

function WizardOption({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-black/25 px-5 py-5 text-center shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C2A878]/55 hover:bg-[#C2A878]/[0.08] hover:shadow-[#C2A878]/10 md:min-h-[190px] md:gap-4 md:p-6 lg:min-h-[210px] lg:p-8"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#C2A878]/30 bg-[#C2A878]/10 text-[#C2A878] shadow-lg shadow-[#C2A878]/10 transition-colors duration-200 group-hover:border-[#C2A878]/60 group-hover:bg-[#C2A878]/20 md:h-16 md:w-16">
        {icon}
      </span>
      <span className="text-sm font-medium leading-snug text-gray-300 transition-colors duration-200 group-hover:text-[#F6F2ED] md:text-base">
        {title}
      </span>
    </button>
  );
}

function WizardFooter({
  onBack,
  onNext,
  submitLabel,
  submitIcon,
  submitDisabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  submitDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6">
      {submitLabel ? (
        <Button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          disabled={submitDisabled}
          className="h-12 w-full rounded-xl border border-[#C2A878]/20 bg-[#6B4F3A] px-6 text-base font-medium text-white shadow-lg shadow-[#6B4F3A]/25 transition-all duration-200 hover:bg-[#5A4230] hover:shadow-[#6B4F3A]/35"
        >
          {submitIcon}
          {submitLabel}
        </Button>
      ) : null}
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 w-full rounded-xl border-white/10 bg-black/20 text-gray-200 hover:border-[#C2A878]/30 hover:bg-[#C2A878]/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>
      ) : null}
    </div>
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
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-[0.18em] text-gray-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
