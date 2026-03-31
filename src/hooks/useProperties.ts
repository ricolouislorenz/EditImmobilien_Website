import { useEffect, useState } from "react";
import type { Property } from "@/types";
import {
  fetchActiveProperties,
  fetchReferenceProperties,
} from "@/lib/supabase";

interface UsePropertiesResult {
  active: Property[];
  references: Property[];
  loading: boolean;
  error: string | null;
}

export function useProperties(): UsePropertiesResult {
  const [active, setActive] = useState<Property[]>([]);
  const [references, setReferences] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [activeData, referenceData] = await Promise.all([
          fetchActiveProperties(),
          fetchReferenceProperties(),
        ]);

        if (!cancelled) {
          setActive(activeData);
          setReferences(referenceData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unbekannter Fehler beim Laden der Immobilien."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { active, references, loading, error };
}
