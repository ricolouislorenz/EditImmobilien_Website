import { createClient } from "@supabase/supabase-js";
import type { Property } from "@/types";
import { uploadPropertyImages } from "./property-uploads";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// ÜBERGABE BETRIEB-01: VITE-Werte sind im Browser sichtbar. Hier nur den öffentlichen
// Supabase-Schlüssel verwenden; niemals Service-Role- oder Mail-Schlüssel eintragen.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    "Supabase: VITE_SUPABASE_URL und/oder VITE_SUPABASE_ANON_KEY fehlen. Datenbank-Funktionen sind deaktiviert."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.invalid",
  supabaseAnonKey ?? "placeholder"
);

// ---------------------------------------------------------------------------
// Storage-Hilfsfunktionen
// ---------------------------------------------------------------------------

const STORAGE_BUCKET = "property-images";

/** Gibt die öffentliche URL eines Bildes im Supabase-Storage zurück. */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Mehrfach-Upload mit eindeutigen Pfaden und Aufräumen nach Teilfehlern. */
export function uploadImages(files: File[], propertyId: string): Promise<string[]> {
  return uploadPropertyImages(files, propertyId, {
    upload: (path, file) => supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false }),
    remove: (paths) => supabase.storage.from(STORAGE_BUCKET).remove(paths),
  });
}

// ---------------------------------------------------------------------------
// Datenbank-Hilfsfunktionen
// ---------------------------------------------------------------------------

/** Alle aktiven Immobilien (für die öffentliche Seite). */
// ÜBERGABE SICHERHEIT-02 [PRÜFEN]: Migrationen 0005/0006 ergänzen Sitzungs- und Bildschutz.
// Die ursprünglichen Tabellen-/Storage-Regeln sind nicht vollständig versioniert; beim Umzug mit sichern.
// select("*") liefert auch die als intern bezeichnete Objektnummer; hier keine vertraulichen Felder ergänzen.
export async function fetchActiveProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Alle Referenz-Immobilien (verkauft / vermietet). */
export async function fetchReferenceProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .neq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Alle Immobilien (für das Admin-Panel). */
export async function fetchAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
