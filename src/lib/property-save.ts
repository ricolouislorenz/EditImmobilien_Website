import { cleanupNewUploads, type ImageRemovalResult } from "./property-uploads.ts";

interface PropertySaveOperations {
  save: () => PromiseLike<{ data: { id: string } | null; error: unknown }>;
  removeImages: (paths: string[]) => PromiseLike<{ error: unknown }>;
}

export class PropertySaveUncertainError extends Error {
  constructor() {
    super("Die Speicherung konnte nicht eindeutig bestätigt werden. Bitte zuerst den gespeicherten Stand prüfen. Neue Bilder wurden vorsichtshalber nicht gelöscht. Erneutes Speichern ist bis zum erneuten Laden gesperrt.");
  }
}

class ConfirmedSaveRejection extends Error {}

/** Nur ausdrückliche Datenbank-Ablehnungen als sicher fehlgeschlagen behandeln. */
function isConfirmedRejection(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error) || typeof error.code !== "string") return false;
  return /^(22|23)[0-9A-Z]{3}$/.test(error.code) || ["42501", "40001", "40P01", "55P03", "PGRST202"].includes(error.code);
}

/** Neue Bilder nur aufräumen, wenn sie sicher nicht durch diesen Speichervorgang verwendet werden. */
export async function savePropertyWithUploads(
  operations: {
    upload: () => Promise<string[]>;
    save: (paths: string[]) => ReturnType<PropertySaveOperations["save"]>;
    removeImages: (paths: string[]) => PromiseLike<ImageRemovalResult>;
  },
  removedImages: string[],
): Promise<{ imageCleanupFailed: boolean }> {
  const paths = await operations.upload();
  try {
    return await savePropertyWithImageCleanup({
      save: async () => {
        const result = await operations.save(paths);
        if (result.error && isConfirmedRejection(result.error)) throw new ConfirmedSaveRejection();
        return result;
      },
      removeImages: async (removedPaths) => ({
        error: await cleanupNewUploads(removedPaths, operations.removeImages)
          ? null : new Error("Bildlöschung wurde nicht vollständig bestätigt."),
      }),
    }, removedImages);
  } catch (error) {
    if (error instanceof ConfirmedSaveRejection) {
      const cleaned = await cleanupNewUploads(paths, operations.removeImages);
      throw new Error(cleaned
        ? "Die Datenbank hat die Speicherung abgelehnt. Bitte die Eingaben und Berechtigungen prüfen."
        : "Die Datenbank hat die Speicherung abgelehnt. Neue Bilder konnten nicht vollständig aufgeräumt werden. Bitte die technische Betreuung um Prüfung bitten.");
    }
    // Bei abgebrochener Antwort könnte der Datensatz bereits gespeichert sein: keine neuen Bilder löschen.
    throw new PropertySaveUncertainError();
  }
}

/** Erst das Speichern bestätigen, dann entfernte Bilder aufräumen. */
export async function savePropertyWithImageCleanup(
  operations: PropertySaveOperations,
  removedImages: string[],
): Promise<{ imageCleanupFailed: boolean }> {
  const { data, error } = await operations.save();
  if (error) throw error;
  // Auch bei fehlenden Schreibrechten kann eine Änderung ohne Fehlermeldung null Zeilen treffen.
  if (!data?.id) throw new Error("Die Speicherung wurde nicht bestätigt. Bitte erneut laden und prüfen.");

  if (removedImages.length === 0) return { imageCleanupFailed: false };

  // ÜBERGABE ADMIN-02 [BEHOBEN]: Alte Bilder erst nach bestätigter Speicherung löschen.
  // Ein Löschfehler ändert nichts am Speichererfolg und wird in der Adminübersicht angezeigt.
  try {
    const { error: deleteError } = await operations.removeImages(removedImages);
    return { imageCleanupFailed: Boolean(deleteError) };
  } catch {
    return { imageCleanupFailed: true };
  }
}
