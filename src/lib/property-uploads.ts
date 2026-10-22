import { getImageValidationError } from "./image-upload.ts";

export interface ImageRemovalResult {
  data: { name: string }[] | null;
  error: unknown;
}
type RemoveImages = (paths: string[]) => PromiseLike<ImageRemovalResult>;

/** Zufällige Dateinamen vermeiden Kollisionen bei gleichzeitig hochgeladenen Bildern. */
export function createImageStoragePath(file: File, propertyId: string): string {
  const validationError = getImageValidationError(file);
  if (validationError) throw new Error(`${file.name}: ${validationError}`);
  return `${propertyId}/${crypto.randomUUID()}.${file.name.split(".").pop()!.toLowerCase()}`;
}

/** Prüft auch die bestätigten Löschungen: fehlende Rechte können ohne Fehler null Dateien löschen. */
export async function cleanupNewUploads(
  paths: string[],
  remove: RemoveImages,
  confirmedUploads: string[] = paths,
): Promise<boolean> {
  if (paths.length === 0) return true;
  try {
    const { data, error } = await remove(paths);
    if (error || !data) return false;
    const removed = new Set(data.map((file) => file.name));
    return confirmedUploads.every((path) => removed.has(path));
  } catch {
    return false;
  }
}

/** ÜBERGABE ADMIN-01: Erst alle Upload-Ergebnisse abwarten, dann einen Teilfehler aufräumen. */
export async function uploadPropertyImages(
  files: File[],
  propertyId: string,
  operations: {
    upload: (path: string, file: File) => PromiseLike<{ error: unknown }>;
    remove: RemoveImages;
  },
): Promise<string[]> {
  // Alle Dateien vor dem ersten Upload prüfen; auch ein Validierungsfehler hinterlässt keine Teilmenge.
  const paths = files.map((file) => createImageStoragePath(file, propertyId));
  const results = await Promise.allSettled(files.map(async (file, index) => {
    const { error } = await operations.upload(paths[index], file);
    if (error) throw error;
  }));
  if (results.every((result) => result.status === "fulfilled")) return paths;

  const confirmed = paths.filter((_, index) => results[index].status === "fulfilled");
  // Auch ein fehlgeschlagener Aufruf kann serverseitig bereits eine Datei angelegt haben.
  // Diese Pfade sind neu und noch in keinem Datensatz gespeichert; keine alten Bilder löschen.
  const cleaned = await cleanupNewUploads(paths, operations.remove, confirmed);
  throw new Error(cleaned
    ? "Mindestens ein Bild konnte nicht hochgeladen werden. Bitte erneut versuchen."
    : "Der Bild-Upload ist fehlgeschlagen. Neue Dateien konnten nicht vollständig aufgeräumt werden. Bitte die technische Betreuung um Prüfung bitten.");
}
