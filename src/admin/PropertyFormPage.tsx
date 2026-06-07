import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Upload, ImagePlus, Hash, Loader2, Home, CheckCircle2 } from "lucide-react";
import { supabase, getImageUrl, uploadImage } from "@/lib/supabase";
import { PROPERTIES_PAGE_SIZE } from "@/lib/pagination";
import type { Property, PropertyInput, PropertyStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROPERTY_TYPES = [
  "Einfamilienhaus",
  "Doppelhaushälfte",
  "Reihenhaus",
  "Eigentumswohnung",
  "Mehrfamilienhaus",
  "Penthouse",
  "Ladenfläche",
  "Sonstiges",
];

/** Genauer Status eines Referenzobjekts (bereits abgeschlossen). */
const REFERENCE_STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: "sold", label: "Verkauft" },
  { value: "rented", label: "Vermietet" },
  { value: "sold_and_rented", label: "Verkauft & Vermietet" },
];

const DEFAULT_REFERENCE_STATUS: PropertyStatus = "sold";

/** Standard-Preisanzeige für ein Referenzobjekt = sein Status-Label. */
function referencePriceLabel(status: PropertyStatus): string {
  return REFERENCE_STATUSES.find((s) => s.value === status)?.label ?? "";
}

/** Prüft, ob ein Preis (noch) ein automatisch gesetztes Status-Label ist. */
function isReferencePriceLabel(price: string): boolean {
  return REFERENCE_STATUSES.some((s) => s.label === price);
}

// Merkt sich die zuletzt gewählte Kategorie/Status für neue Immobilien.
// sessionStorage: überlebt einen Seiten-Reload, setzt sich beim Sitzungsende zurück.
const NEW_STATUS_STORAGE_KEY = "admin:new-property-status";

function isPropertyStatus(value: unknown): value is PropertyStatus {
  return (
    value === "active" ||
    value === "sold" ||
    value === "rented" ||
    value === "sold_and_rented"
  );
}

/** Liest den zuletzt für eine neue Immobilie genutzten Status. Fallback: "active". */
function readStoredNewStatus(): PropertyStatus {
  try {
    const value = sessionStorage.getItem(NEW_STATUS_STORAGE_KEY);
    if (isPropertyStatus(value)) return value;
  } catch {
    // sessionStorage nicht verfügbar – Standard verwenden.
  }
  return "active";
}

const EMPTY_FORM: PropertyInput = {
  title: "",
  location: "",
  price: "",
  type: "Einfamilienhaus",
  status: "active",
  bedrooms: null,
  bathrooms: null,
  area: null,
  area_label: null,
  images: [],
  sort_order: 0,
};

/** Zerlegt "25488 Holm" in PLZ und Ort. */
function parseLocation(location: string): { plz: string; ort: string } {
  const match = location.match(/^\s*(\d{5})\s*(.*)$/);
  return match
    ? { plz: match[1], ort: match[2].trim() }
    : { plz: "", ort: location.trim() };
}

/** Abschnitt mit Überschrift, um das Formular übersichtlich zu gliedern. */
function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#C2A878]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** Zahlenfeld mit −/+ links und rechts (statt der eng beieinander liegenden nativen Pfeile). */
function StepperField({
  value,
  onChange,
  step = 1,
  min = 0,
  className,
}: {
  value: number | null;
  onChange: (val: number | null) => void;
  step?: number;
  min?: number;
  className?: string;
}) {
  const isDecimal = !Number.isInteger(step);
  const round = (n: number) =>
    isDecimal ? Math.round(n * 100) / 100 : Math.round(n);

  const apply = (n: number) => onChange(round(Math.max(min, n)));
  const base = value ?? min;

  const handleText = (raw: string) => {
    const cleaned = raw
      .replace(",", ".")
      .replace(isDecimal ? /[^0-9.]/g : /[^0-9]/g, "");
    if (cleaned === "") {
      onChange(null);
      return;
    }
    const parsed = Number(cleaned);
    if (!Number.isNaN(parsed)) onChange(parsed);
  };

  return (
    <div
      className={`flex h-10 overflow-hidden rounded-md border border-white/10 bg-[#111111] ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => apply(base - step)}
        aria-label="Verringern"
        className="flex w-10 shrink-0 items-center justify-center border-r border-white/10 text-lg leading-none text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        −
      </button>
      <input
        type="text"
        inputMode={isDecimal ? "decimal" : "numeric"}
        value={value ?? ""}
        onChange={(e) => handleText(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-center text-sm text-white placeholder:text-gray-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => apply(base + step)}
        aria-label="Erhöhen"
        className="flex w-10 shrink-0 items-center justify-center border-l border-white/10 text-lg leading-none text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        +
      </button>
    </div>
  );
}

export function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState<PropertyInput>(() => {
    if (!isNew) return EMPTY_FORM;
    const status = readStoredNewStatus();
    return {
      ...EMPTY_FORM,
      status,
      price: status === "active" ? "" : referencePriceLabel(status),
    };
  });
  const [reference, setReference] = useState<string | null>(null);
  const initialSortOrder = useRef<number | null>(null);
  // Zuletzt gewählter Referenz-Status, um beim Umschalten Aktiv -> Referenz sinnvoll zu starten.
  const lastReferenceStatus = useRef<PropertyStatus>(
    isNew && readStoredNewStatus() !== "active"
      ? readStoredNewStatus()
      : DEFAULT_REFERENCE_STATUS
  );
  const [siblings, setSiblings] = useState<
    { status: string; sort_order: number }[]
  >([]);
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");
  const [plzLoading, setPlzLoading] = useState(false);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;

    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Immobilie nicht gefunden.");
        } else {
          const {
            id: _id,
            reference: ref,
            created_at: _ca,
            updated_at: _ua,
            ...input
          } = data as Property;
          setReference(ref);
          setForm(input);
          initialSortOrder.current = input.sort_order;
          const parsed = parseLocation(input.location);
          setPlz(parsed.plz);
          setOrt(parsed.ort);
        }
        setLoading(false);
      });
  }, [id, isNew]);

  // Geschwister-Immobilien für die Seitenberechnung laden.
  useEffect(() => {
    let cancelled = false;

    supabase
      .from("properties")
      .select("id, status, sort_order")
      .then(({ data }) => {
        if (cancelled || !data) return;
        setSiblings(
          (data as { id: string; status: string; sort_order: number }[])
            .filter((p) => p.id !== id)
            .map(({ status, sort_order }) => ({ status, sort_order }))
        );
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  /** Ort über die PLZ ermitteln (manuell überschreibbar). */
  async function lookupOrt(code: string) {
    setPlzLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/de/${code}`);
      if (res.ok) {
        const data = await res.json();
        const place = data?.places?.[0]?.["place name"];
        if (place) setOrt(place);
      }
    } catch {
      // Kein Treffer / offline – Ort kann manuell eingegeben werden.
    } finally {
      setPlzLoading(false);
    }
  }

  function handlePlzChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPlz(next);
    if (next.length === 5) lookupOrt(next);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  // Bei neuen Immobilien die zuletzt gewählte Kategorie/Status merken (Reload-fest).
  useEffect(() => {
    if (!isNew) return;
    try {
      sessionStorage.setItem(NEW_STATUS_STORAGE_KEY, form.status);
    } catch {
      // sessionStorage nicht verfügbar – Merken überspringen.
    }
  }, [isNew, form.status]);

  /** Kategorie umschalten: Aktive Immobilie <-> Referenzobjekt. */
  function handleCategoryChange(category: "active" | "reference") {
    setForm((prev) => {
      if (category === "active") {
        // Ein automatisch gesetztes Status-Label im Preis wieder leeren,
        // eine echte Preisangabe aber erhalten.
        return {
          ...prev,
          status: "active",
          price: isReferencePriceLabel(prev.price) ? "" : prev.price,
        };
      }
      const status = lastReferenceStatus.current;
      return { ...prev, status, price: referencePriceLabel(status) };
    });
  }

  /** Genauen Referenz-Status wählen (Verkauft / Vermietet / …). */
  function handleReferenceStatusChange(status: PropertyStatus) {
    lastReferenceStatus.current = status;
    // Preis folgt dem Status, sofern er nicht individuell überschrieben wurde.
    setForm((prev) => ({
      ...prev,
      status,
      price: isReferencePriceLabel(prev.price) || prev.price === ""
        ? referencePriceLabel(status)
        : prev.price,
    }));
  }

  /** Nimmt neue Bilddateien an (Upload-Button oder Drag & Drop). */
  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files ?? []);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  function removeExistingImage(path: string) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== path),
    }));
    setRemovedImages((prev) => [...prev, path]);
  }

  function removeNewFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^\d{5}$/.test(plz)) {
      setError("Bitte eine gültige 5-stellige PLZ eingeben.");
      return;
    }
    if (!ort.trim()) {
      setError("Bitte einen Ort angeben.");
      return;
    }

    setSaving(true);

    try {
      const propertyId = isNew ? crypto.randomUUID() : id!;
      const target = form.sort_order;

      // Neue Bilder hochladen
      const uploadedPaths = await Promise.all(
        newFiles.map((file) => uploadImage(file, propertyId))
      );

      // Gelöschte Bilder aus Storage entfernen (im Hintergrund, kein Fehler wenn es scheitert)
      if (removedImages.length > 0) {
        await supabase.storage.from("property-images").remove(removedImages);
      }

      // Nur umsortieren, wenn die Position neu vergeben oder tatsächlich geändert wurde.
      // Belegte Zielposition? Dann alle ab dieser Position um eins nach hinten schieben.
      if (isNew || target !== initialSortOrder.current) {
        const { error: shiftError } = await supabase.rpc("shift_property_order", {
          p_target: target,
          p_exclude: propertyId,
        });
        if (shiftError) throw shiftError;
      }

      // Die Immobilien-ID (reference) wird fortlaufend von der Datenbank vergeben
      // und daher hier bewusst nicht mitgeschickt.
      const payload = {
        ...form,
        location: `${plz} ${ort.trim()}`,
        images: [...form.images, ...uploadedPaths],
        updated_at: new Date().toISOString(),
        ...(isNew && {
          id: propertyId,
          created_at: new Date().toISOString(),
        }),
      };

      const { error: dbError } = isNew
        ? await supabase.from("properties").insert(payload)
        : await supabase.from("properties").update(payload).eq("id", propertyId);

      if (dbError) throw dbError;

      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">Laden...</p>;

  const totalImages = form.images.length + previews.length;

  const category: "active" | "reference" =
    form.status === "active" ? "active" : "reference";

  // Auf welcher Seite der öffentlichen Liste erscheint die Immobilie?
  const isActiveTab = form.status === "active";
  const sameTab = siblings.filter((s) => (s.status === "active") === isActiveTab);
  const rank = sameTab.filter((s) => s.sort_order < form.sort_order).length + 1;
  const placementPage = Math.floor((rank - 1) / PROPERTIES_PAGE_SIZE) + 1;
  const totalInTab = sameTab.length + 1;
  const tabLabel = isActiveTab ? "Aktuell" : "Referenzen";

  return (
    <div className="max-w-3xl">
      {/* Kopfzeile mit Immobilien-ID */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {isNew ? "Neue Immobilie" : "Immobilie bearbeiten"}
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C2A878]/30 bg-[#C2A878]/10 px-3 py-1 text-sm text-[#C2A878]">
          <Hash className="h-3.5 w-3.5" />
          {isNew ? "Immobilien-ID wird automatisch vergeben" : reference ?? "—"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection
          title="Eckdaten"
          description="Diese Angaben erscheinen auf der Karte und in der Detailansicht."
        >
          <div>
            <Label className="text-gray-300">Titel *</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Modernes Einfamilienhaus mit Garten"
              className="bg-[#111111] border-white/10 text-white mt-1"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <Label className="text-gray-300">PLZ *</Label>
              <div className="relative">
                <Input
                  name="plz"
                  value={plz}
                  onChange={handlePlzChange}
                  required
                  inputMode="numeric"
                  placeholder="25488"
                  className="bg-[#111111] border-white/10 text-white mt-1"
                />
                {plzLoading && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#C2A878]" />
                )}
              </div>
            </div>
            <div>
              <Label className="text-gray-300">
                Ort *{" "}
                <span className="text-gray-500 text-xs">— aus PLZ ermittelt, überschreibbar</span>
              </Label>
              <Input
                name="ort"
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
                required
                placeholder="wird automatisch ergänzt"
                className="bg-[#111111] border-white/10 text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">
              Preis *{" "}
              {category === "reference" && (
                <span className="text-gray-500 text-xs">
                  — entspricht dem Status, frei überschreibbar
                </span>
              )}
            </Label>
            <Input
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              placeholder={category === "active" ? "z. B. € 595.000" : "z. B. Verkauft"}
              className="bg-[#111111] border-white/10 text-white mt-1"
            />
          </div>

          {/* Kategorie: Aktive Immobilie oder Referenzobjekt */}
          <div>
            <Label className="text-gray-300">Kategorie *</Label>
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleCategoryChange("active")}
                aria-pressed={category === "active"}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  category === "active"
                    ? "border-[#C2A878] bg-[#C2A878]/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <Home
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    category === "active" ? "text-[#C2A878]" : "text-gray-400"
                  }`}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    Aktive Immobilie
                  </span>
                  <span className="block text-xs text-gray-500">
                    Erscheint unter „Aktuell"
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange("reference")}
                aria-pressed={category === "reference"}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  category === "reference"
                    ? "border-[#C2A878] bg-[#C2A878]/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <CheckCircle2
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    category === "reference" ? "text-[#C2A878]" : "text-gray-400"
                  }`}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    Referenzobjekt
                  </span>
                  <span className="block text-xs text-gray-500">
                    Bereits abgeschlossen
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Typ und – bei Referenzobjekten – der genaue Status */}
          <div
            className={`grid grid-cols-1 gap-4 ${
              category === "reference" ? "sm:grid-cols-2" : ""
            }`}
          >
            <div>
              <Label className="text-gray-300">Typ *</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full mt-1 bg-[#111111] border border-white/10 text-white rounded-md px-3 py-2 text-sm"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {category === "reference" && (
              <div>
                <Label className="text-gray-300">Status *</Label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleReferenceStatusChange(e.target.value as PropertyStatus)
                  }
                  required
                  className="w-full mt-1 bg-[#111111] border border-white/10 text-white rounded-md px-3 py-2 text-sm"
                >
                  {REFERENCE_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Details"
          description="Optionale Angaben – leere Felder werden nicht angezeigt."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-gray-300">Zimmer</Label>
              <StepperField
                value={form.bedrooms}
                step={0.5}
                onChange={(v) => setForm((p) => ({ ...p, bedrooms: v }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Bäder</Label>
              <StepperField
                value={form.bathrooms}
                step={0.5}
                onChange={(v) => setForm((p) => ({ ...p, bathrooms: v }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Fläche (m²)</Label>
              <StepperField
                value={form.area}
                step={1}
                onChange={(v) => setForm((p) => ({ ...p, area: v }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">
              Fläche (Freitext){" "}
              <span className="text-gray-500 text-xs">— z. B. "923 Wohnfläche + 385 Gewerbe"</span>
            </Label>
            <Input
              name="area_label"
              value={form.area_label ?? ""}
              onChange={handleChange}
              placeholder="Überschreibt die m²-Angabe, wenn gesetzt"
              className="bg-[#111111] border-white/10 text-white mt-1"
            />
          </div>
        </FormSection>

        <FormSection
          title="Bilder"
          description="Per Klick auswählen oder Dateien direkt in den Bereich ziehen. Das erste Bild ist das Titelbild."
        >
          {/* Drag-&-Drop-Bereich */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C2A878]/50 ${
              dragActive
                ? "border-[#C2A878] bg-[#C2A878]/10"
                : "border-white/15 hover:border-[#C2A878]/50 hover:bg-white/5"
            }`}
          >
            <ImagePlus className="h-7 w-7 text-[#C2A878]" />
            <p className="text-sm text-gray-300">
              Bilder hierher ziehen oder{" "}
              <span className="text-[#C2A878] underline">auswählen</span>
            </p>
            <p className="text-xs text-gray-500">JPG, PNG oder WebP</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {totalImages > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {totalImages} {totalImages === 1 ? "Bild" : "Bilder"}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/10 text-gray-300 hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Weitere hinzufügen
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Vorhandene Bilder */}
                {form.images.map((path) => (
                  <div key={path} className="relative h-24 w-24">
                    <img
                      src={getImageUrl(path)}
                      alt=""
                      className="h-full w-full rounded-md border border-white/10 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(path)}
                      aria-label="Bild entfernen"
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-0.5 hover:bg-red-500"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}

                {/* Neue Datei-Vorschauen */}
                {previews.map((src, i) => (
                  <div key={src} className="relative h-24 w-24">
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full rounded-md border border-[#C2A878]/40 object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[10px] text-[#C2A878]">
                      neu
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      aria-label="Bild entfernen"
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-0.5 hover:bg-red-500"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        <FormSection
          title="Sortierung"
          description="Niedrigere Zahl = weiter oben. Wird eine belegte Position gewählt, rücken die übrigen Immobilien automatisch nach hinten."
        >
          <div>
            <Label className="text-gray-300">Reihenfolge</Label>
            <StepperField
              value={form.sort_order}
              step={1}
              onChange={(v) => setForm((p) => ({ ...p, sort_order: v ?? 0 }))}
              className="mt-1 w-32"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm">
            <p className="text-gray-300">
              Erscheint im Tab <span className="text-[#C2A878]">„{tabLabel}"</span> auf{" "}
              <span className="font-medium text-white">Seite {placementPage}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Position {rank} von {totalInTab} · {PROPERTIES_PAGE_SIZE} pro Seite · ohne aktive Besucher-Filter
            </p>
          </div>
        </FormSection>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Aktionsleiste */}
        <div className="sticky bottom-0 -mx-1 flex gap-3 border-t border-white/10 bg-[#111111]/95 px-1 py-4 backdrop-blur">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 flex-1 sm:h-10 sm:flex-none sm:min-w-32"
          >
            {saving ? "Speichern..." : "Speichern"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 border-white/10 text-gray-300 hover:text-white sm:h-10 sm:flex-none"
            onClick={() => navigate("/admin")}
          >
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
