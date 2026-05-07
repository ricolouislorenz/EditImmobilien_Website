import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
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

const CALENDLY_URL = "https://calendly.com/kontakt-edit-immobilien/30min";
const PHONE_HREF = "tel:+4917290377547";

type InquiryType = "offer" | "search" | "general";
type ContactMethod = "phone" | "appointment" | "email";
type WizardStep = "inquiry" | "method" | "name" | "email";

const inquiryOptions: Array<{
  id: InquiryType;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: "offer",
    title: "Immobilie vermieten/verkaufen",
    description: "Für Eigentümer, die eine Immobilie anbieten möchten.",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "search",
    title: "Immobilie mieten/kaufen",
    description: "Für Interessenten, die ein neues Zuhause suchen.",
    icon: <Search className="h-5 w-5" />,
  },
  {
    id: "general",
    title: "Allgemeine Anfrage",
    description: "Für Fragen, Rückmeldungen oder sonstige Anliegen.",
    icon: <MessageSquareText className="h-5 w-5" />,
  },
];

const methodOptions: Array<{
  id: ContactMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: "phone",
    title: "Jetzt anrufen",
    description: "Startet direkt einen Anruf bei EDIT Immobilien.",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: "appointment",
    title: "Termin vereinbaren",
    description: "Öffnet das hinterlegte Calendly-Fenster.",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    id: "email",
    title: "Direkt schreiben",
    description: "Fragt kurz Ihre Daten ab und sendet eine E-Mail.",
    icon: <Mail className="h-5 w-5" />,
  },
];

const stepLabels: Record<WizardStep, string> = {
  inquiry: "Anliegen",
  method: "Kontaktweg",
  name: "Name",
  email: "E-Mail",
};

const methodCtaLabels: Record<ContactMethod, string> = {
  phone: "Jetzt anrufen",
  appointment: "Termin öffnen",
  email: "Weiter zu Ihren Daten",
};

function getMethodCtaLabel(contactMethod: ContactMethod | "") {
  return contactMethod ? methodCtaLabels[contactMethod] : "Kontaktweg auswählen";
}

export function ContactSection() {
  const [step, setStep] = useState<WizardStep>("inquiry");
  const [formData, setFormData] = useState({
    inquiryType: "" as InquiryType | "",
    contactMethod: "" as ContactMethod | "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedInquiry = useMemo(
    () => inquiryOptions.find((option) => option.id === formData.inquiryType),
    [formData.inquiryType],
  );

  const handleInquirySelect = (inquiryType: InquiryType) => {
    setFormData((current) => ({
      ...current,
      inquiryType,
      contactMethod: "",
    }));
  };

  const handleInquiryContinue = () => {
    setStep("method");
  };

  const handleMethodSelect = (contactMethod: ContactMethod) => {
    setFormData((current) => ({ ...current, contactMethod }));
  };

  const handleMethodContinue = () => {
    if (formData.contactMethod === "phone") {
      window.location.href = PHONE_HREF;
      toast.info("Der Anruf wird gestartet.");
      return;
    }

    if (formData.contactMethod === "appointment") {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      toast.info("Das Terminfenster wurde geöffnet.");
      return;
    }

    if (formData.contactMethod === "email") {
      setStep("name");
    }
  };

  const handleBack = () => {
    if (step === "method") {
      setStep("inquiry");
      return;
    }

    if (step === "name") {
      setStep("method");
      return;
    }

    if (step === "email") {
      setStep("name");
    }
  };

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("email");
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const message = [
      "Neue Kontaktanfrage über den Website-Assistenten",
      "",
      `Anliegen: ${selectedInquiry?.title ?? "Allgemeine Anfrage"}`,
      "Gewünschter Kontaktweg: Direkt schreiben",
      "",
      "Bitte per E-Mail antworten.",
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
      });
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
        <div className="mx-auto mb-12 max-w-4xl">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-[#C2A878]">Kontakt</p>
            <h2 className="mb-4 text-white">Wir sind persönlich für Sie da</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
              Wählen Sie kurz aus, worum es geht. Danach entscheiden Sie, ob Sie direkt anrufen,
              einen Termin buchen oder uns schreiben möchten.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-1 sm:px-0">
          <div
            className="relative flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-[#C2A878]/20 bg-[#1a1a1a] p-6 shadow-2xl shadow-black/25 sm:min-h-[540px] sm:p-9 lg:p-12"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(194,168,120,0.12), transparent 34%), linear-gradient(145deg, rgba(30,27,24,0.98) 0%, rgba(18,16,14,1) 100%)",
            }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C2A878]/50 to-transparent" />
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/[0.07] pb-6">
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-[#C2A878]">
                  Kontaktassistent
                </p>
                <h3 className="text-xl font-semibold text-[#F6F2ED]">{stepLabels[step]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {selectedInquiry
                    ? `Ausgewählt: ${selectedInquiry.title}`
                    : "Starten Sie mit der Auswahl Ihres Anliegens."}
                </p>
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#C2A878]/25 bg-[#C2A878]/10 shadow-lg shadow-[#C2A878]/10 sm:flex">
                <Mail className="h-5 w-5 text-[#C2A878]" />
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              {step === "inquiry" && (
                <WizardPanel>
                  <OptionGrid>
                    {inquiryOptions.map((option) => (
                      <WizardOption
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        description={option.description}
                        selected={formData.inquiryType === option.id}
                        onClick={() => handleInquirySelect(option.id)}
                      />
                    ))}
                  </OptionGrid>
                  {formData.inquiryType ? (
                    <WizardFooter
                      onNext={handleInquiryContinue}
                      submitLabel="Weiter zum Kontaktweg"
                    />
                  ) : null}
                </WizardPanel>
              )}

              {step === "method" && (
                <WizardPanel
                  title="Wie möchten Sie Kontakt aufnehmen?"
                  description="Wählen Sie den gewünschten Kontaktweg. Der Button unten führt den nächsten Schritt aus."
                >
                  <OptionGrid>
                    {methodOptions.map((option) => (
                      <WizardOption
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        description={option.description}
                        selected={formData.contactMethod === option.id}
                        onClick={() => handleMethodSelect(option.id)}
                      />
                    ))}
                  </OptionGrid>
                  <WizardFooter
                    onBack={handleBack}
                    onNext={handleMethodContinue}
                    submitLabel={getMethodCtaLabel(formData.contactMethod)}
                    submitDisabled={!formData.contactMethod}
                  />
                </WizardPanel>
              )}

              {step === "name" && (
                <form onSubmit={handleNameSubmit} className="flex flex-1 flex-col">
                  <WizardPanel
                    title="Wie dürfen wir Sie ansprechen?"
                    description="Vorname und Nachname werden getrennt abgefragt."
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Vorname *" htmlFor="firstName">
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={(event) =>
                            setFormData((current) => ({ ...current, firstName: event.target.value }))
                          }
                          required
                          placeholder="Max"
                          className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                        />
                      </Field>
                      <Field label="Nachname *" htmlFor="lastName">
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={(event) =>
                            setFormData((current) => ({ ...current, lastName: event.target.value }))
                          }
                          required
                          placeholder="Mustermann"
                          className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                        />
                      </Field>
                    </div>
                    <WizardFooter onBack={handleBack} submitLabel="Weiter" />
                  </WizardPanel>
                </form>
              )}

              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="flex flex-1 flex-col">
                  <WizardPanel
                    title="An welche E-Mail-Adresse dürfen wir antworten?"
                    description="Ihr Anliegen und Ihr Name werden automatisch in die Nachricht übernommen."
                  >
                    <Field label="E-Mail *" htmlFor="email">
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
                        className="h-12 rounded-xl border-white/10 bg-black/20 text-white shadow-inner shadow-black/20 placeholder:text-gray-600 focus:border-[#C2A878] focus:ring-0"
                      />
                    </Field>
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
    <div className="flex flex-1 flex-col">
      {(title || description) && (
        <div className="mb-5">
          {title && <h4 className="text-lg font-semibold text-white sm:text-xl">{title}</h4>}
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-3 lg:gap-5">{children}</div>;
}

function WizardOption({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 sm:p-5 md:min-h-[190px] md:flex-col md:items-start md:justify-start ${
        selected
          ? "border-[#C2A878] bg-[#C2A878]/15 shadow-xl shadow-[#C2A878]/15 ring-1 ring-[#C2A878]/45"
          : "border-white/[0.12] bg-black/25 shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:border-[#C2A878]/55 hover:bg-[#C2A878]/[0.08] hover:shadow-[#C2A878]/10"
      }`}
    >
      {selected ? (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#C2A878] text-[#111111] shadow-lg shadow-[#C2A878]/20">
          <Check className="h-4 w-4" />
        </span>
      ) : null}
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[#C2A878] shadow-lg shadow-[#C2A878]/10 ${
          selected ? "border-[#C2A878]/70 bg-[#C2A878]/20" : "border-[#C2A878]/30 bg-[#C2A878]/10"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block pr-8 text-base font-semibold text-[#F6F2ED] md:pr-0">{title}</span>
        <span className="mt-2 block text-sm leading-relaxed text-gray-500">{description}</span>
        <span
          className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
            selected
              ? "border-[#C2A878] bg-[#C2A878] text-[#111111]"
              : "border-[#C2A878]/30 bg-[#C2A878]/10 text-[#C2A878] group-hover:border-[#C2A878]/60"
          }`}
        >
          {selected ? "Ausgewählt" : "Auswählen"}
        </span>
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
    <div className="mt-auto flex flex-col-reverse gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 w-full rounded-xl border-white/10 bg-black/20 text-gray-200 hover:border-[#C2A878]/30 hover:bg-[#C2A878]/10 hover:text-white sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}
      {submitLabel ? (
        <Button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          disabled={submitDisabled}
          className="h-11 w-full rounded-xl border border-[#C2A878]/20 bg-[#6B4F3A] px-6 font-medium text-white shadow-lg shadow-[#6B4F3A]/25 transition-all duration-200 hover:bg-[#5A4230] hover:shadow-[#6B4F3A]/35 sm:w-auto"
        >
          {submitIcon}
          {submitLabel}
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
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}
