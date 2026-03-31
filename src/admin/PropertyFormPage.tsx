import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Upload } from "lucide-react";
import { supabase, getImageUrl, uploadImage } from "@/lib/supabase";
import type { Property, PropertyInput } from "@/types";
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

const STATUSES = [
  { value: "active", label: "Aktiv" },
  { value: "sold", label: "Verkauft" },
  { value: "rented", label: "Vermietet" },
  { value: "sold_and_rented", label: "Verkauft & Vermietet" },
];

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

export function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState<PropertyInput>(EMPTY_FORM);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
          const { id: _id, created_at: _ca, updated_at: _ua, ...input } = data as Property;
          setForm(input);
        }
        setLoading(false);
      });
  }, [id, isNew]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
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
    setSaving(true);
    setError(null);

    try {
      const propertyId = isNew ? crypto.randomUUID() : id!;

      // Neue Bilder hochladen
      const uploadedPaths = await Promise.all(
        newFiles.map((file) => uploadImage(file, propertyId))
      );

      // Gelöschte Bilder aus Storage entfernen (im Hintergrund, kein Fehler wenn es scheitert)
      if (removedImages.length > 0) {
        await supabase.storage.from("property-images").remove(removedImages);
      }

      const payload = {
        ...form,
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

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">
        {isNew ? "Neue Immobilie" : "Immobilie bearbeiten"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titel */}
        <div>
          <Label className="text-gray-300">Titel *</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-[#1a1a1a] border-white/10 text-white mt-1"
          />
        </div>

        {/* Ort */}
        <div>
          <Label className="text-gray-300">Ort *</Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="25488 Holm"
            className="bg-[#1a1a1a] border-white/10 text-white mt-1"
          />
        </div>

        {/* Preis */}
        <div>
          <Label className="text-gray-300">Preis *</Label>
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="€ 595.000 oder VERKAUFT"
            className="bg-[#1a1a1a] border-white/10 text-white mt-1"
          />
        </div>

        {/* Typ & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Typ *</Label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 py-2 text-sm"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-gray-300">Status *</Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zimmer / Bäder / Fläche */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300">Zimmer</Label>
            <Input
              name="bedrooms"
              type="number"
              min={0}
              step={0.5}
              value={form.bedrooms ?? ""}
              onChange={handleNumberChange}
              className="bg-[#1a1a1a] border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">Bäder</Label>
            <Input
              name="bathrooms"
              type="number"
              min={0}
              step={0.5}
              value={form.bathrooms ?? ""}
              onChange={handleNumberChange}
              className="bg-[#1a1a1a] border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">Fläche (m²)</Label>
            <Input
              name="area"
              type="number"
              min={0}
              value={form.area ?? ""}
              onChange={handleNumberChange}
              className="bg-[#1a1a1a] border-white/10 text-white mt-1"
            />
          </div>
        </div>

        {/* Fläche Freitext (Sonderfälle) */}
        <div>
          <Label className="text-gray-300">
            Fläche (Freitext){" "}
            <span className="text-gray-500 text-xs">— z. B. "923 Wohnfläche + 385 Gewerbe"</span>
          </Label>
          <Input
            name="area_label"
            value={form.area_label ?? ""}
            onChange={handleChange}
            className="bg-[#1a1a1a] border-white/10 text-white mt-1"
          />
        </div>

        {/* Sortierung */}
        <div>
          <Label className="text-gray-300">
            Reihenfolge{" "}
            <span className="text-gray-500 text-xs">— niedrigere Zahl = weiter oben</span>
          </Label>
          <Input
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={handleNumberChange}
            className="bg-[#1a1a1a] border-white/10 text-white mt-1 w-24"
          />
        </div>

        {/* Bilder */}
        <div>
          <Label className="text-gray-300 block mb-2">Bilder</Label>

          {/* Vorhandene Bilder */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((path) => (
                <div key={path} className="relative w-24 h-24">
                  <img
                    src={getImageUrl(path)}
                    alt=""
                    className="w-full h-full object-cover rounded-md border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(path)}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 hover:bg-red-500"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Neue Datei-Vorschauen */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={src} className="relative w-24 h-24">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover rounded-md border border-[#C2A878]/40"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 hover:bg-red-500"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-white/10 text-gray-300 hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bilder hinzufügen
          </Button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Speichern..." : "Speichern"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-gray-400"
            onClick={() => navigate("/admin")}
          >
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
