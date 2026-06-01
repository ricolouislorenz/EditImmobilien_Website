import { useEffect, useState } from "react";
import type { Property } from "@/types";
import {
  fetchActiveProperties,
  fetchReferenceProperties,
  isSupabaseConfigured,
} from "@/lib/supabase";

interface UsePropertiesResult {
  active: Property[];
  references: Property[];
  loading: boolean;
  error: string | null;
  /** true, wenn aus dem lokalen Cache statt aus der DB geliefert wird */
  fromCache: boolean;
}

interface CachedProperties {
  active: Property[];
  references: Property[];
  ts: number;
}

const CACHE_KEY = "edit-properties-cache-v1";

/** Liest den zuletzt erfolgreich geladenen Stand aus dem localStorage. */
function readCache(): CachedProperties | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedProperties;
    if (!Array.isArray(parsed.active) || !Array.isArray(parsed.references)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Speichert den aktuellen Stand als Ausfallsicherung. */
function writeCache(active: Property[], references: Property[]): void {
  try {
    const payload: CachedProperties = { active, references, ts: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage nicht verfügbar (z. B. privater Modus) – Cache überspringen.
  }
}

export function useProperties(): UsePropertiesResult {
  const cached = typeof window !== "undefined" ? readCache() : null;

  const [active, setActive] = useState<Property[]>(cached?.active ?? []);
  const [references, setReferences] = useState<Property[]>(
    cached?.references ?? []
  );
  // Mit gecachten Daten kann sofort gerendert werden – kein Lade-Spinner nötig.
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(Boolean(cached));

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured) {
      setError("Datenbank ist nicht konfiguriert.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [activeData, referenceData] = await Promise.all([
          fetchActiveProperties(),
          fetchReferenceProperties(),
        ]);

        if (cancelled) return;

        setActive(activeData);
        setReferences(referenceData);
        setError(null);
        setFromCache(false);
        writeCache(activeData, referenceData);
      } catch (err) {
        if (cancelled) return;

        // Fällt die DB aus (z. B. pausiertes Free-Tier-Projekt), wird der
        // letzte erfolgreich geladene Stand weiter angezeigt.
        const fallback = readCache();
        if (fallback) {
          setActive(fallback.active);
          setReferences(fallback.references);
          setFromCache(true);
          setError(null);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Unbekannter Fehler beim Laden der Immobilien."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { active, references, loading, error, fromCache };
}
