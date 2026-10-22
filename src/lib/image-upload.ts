export const MAX_PROPERTY_IMAGES = 20;
export const MAX_IMAGE_BYTES = 10_000_000;
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

type ImageFile = Pick<File, "name" | "type" | "size">;
const IMAGE_EXTENSIONS = new Map<string, readonly string[]>([
  ["image/jpeg", ["jpg", "jpeg"]],
  ["image/png", ["png"]],
  ["image/webp", ["webp"]],
]);

// ÜBERGABE SICHERHEIT-05 [TEILWEISE BEHOBEN]: Browser prüft Formatangabe,
// Dateiendung und Größe. Supabase muss Uploads zusätzlich unabhängig davon begrenzen.
export function getImageValidationError(file: ImageFile): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extensions = IMAGE_EXTENSIONS.get(file.type.toLowerCase());
  if (!extensions?.includes(extension)) {
    return "Nur JPEG (.jpg/.jpeg), PNG und WebP mit passender Formatangabe sind erlaubt.";
  }
  if (file.size === 0) return "Die Datei ist leer.";
  if (file.size > MAX_IMAGE_BYTES) return "Die Datei ist größer als 10 MB.";
  return null;
}

/** Übernimmt passende Dateien in Auswahlreihenfolge; bestehende und neue Bilder zählen gemeinsam. */
export function selectImageFiles<T extends ImageFile>(files: T[], currentCount: number): {
  accepted: T[];
  errors: string[];
} {
  const accepted: T[] = [];
  const errors: string[] = [];
  for (const file of files) {
    const error = getImageValidationError(file);
    if (error) {
      errors.push(`${file.name}: ${error}`);
    } else if (currentCount + accepted.length >= MAX_PROPERTY_IMAGES) {
      errors.push(`${file.name}: Maximal 20 Bilder je Immobilie. Bitte zuerst ein Bild entfernen.`);
    } else {
      accepted.push(file);
    }
  }
  return { accepted, errors };
}
