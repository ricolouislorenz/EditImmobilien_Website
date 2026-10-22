interface PropertySaveOperations {
  save: () => PromiseLike<{ data: { id: string } | null; error: unknown }>;
  removeImages: (paths: string[]) => PromiseLike<{ error: unknown }>;
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
