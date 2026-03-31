import { createClient } from "@supabase/supabase-js";
import type { Property } from "@/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen in der .env gesetzt sein."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Storage-Hilfsfunktionen
// ---------------------------------------------------------------------------

const STORAGE_BUCKET = "property-images";

/** Gibt die öffentliche URL eines Bildes im Supabase-Storage zurück. */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Lädt eine Bilddatei in den Supabase-Storage hoch.
 *  Gibt den Storage-Pfad zurück, z. B. "property-abc123/bild.jpg". */
export async function uploadImage(
  file: File,
  propertyId: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${propertyId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false });

  if (error) throw error;
  return path;
}

/** Löscht ein Bild aus dem Supabase-Storage. */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Datenbank-Hilfsfunktionen
// ---------------------------------------------------------------------------

/** Alle aktiven Immobilien (für die öffentliche Seite). */
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
