// ÜBERGABE SICHERHEIT-04 [BEHOBEN]: Beide Mailformulare prüfen Größe und Datentypen
// vor der Verarbeitung. Das Leselimit gilt auch ohne oder mit falscher Content-Length.
export const MAX_FORM_BYTES = 64 * 1024;

export class FormInputError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Liest höchstens 64 KiB JSON; bekannte Felder müssen begrenzte Texte sein. */
export async function readFormFields(
  request: Request,
  limits: Record<string, number>,
): Promise<Record<string, string>> {
  const mediaType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw new FormInputError(415, "Bitte Formulardaten als JSON senden.");
  }

  const declaredSize = request.headers.get("Content-Length");
  if (declaredSize !== null && Number(declaredSize) > MAX_FORM_BYTES) {
    throw new FormInputError(413, "Formulardaten sind zu groß.");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new FormInputError(400, "Formulardaten fehlen.");

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FORM_BYTES) {
        // Nicht auf weitere Daten warten; ein Abbruchfehler verdeckt die Ablehnung nicht.
        void reader.cancel().catch(() => {});
        throw new FormInputError(413, "Formulardaten sind zu groß.");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof FormInputError) throw error;
    throw new FormInputError(400, "Formulardaten konnten nicht gelesen werden.");
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new FormInputError(400, "Ungültiges JSON.");
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new FormInputError(400, "Ungültige Formulardaten.");
  }

  const input = payload as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [field, maxLength] of Object.entries(limits)) {
    const value = Object.hasOwn(input, field) ? input[field] : "";
    if (typeof value !== "string") {
      throw new FormInputError(400, "Formularfelder müssen Text enthalten.");
    }
    if (value.length > maxLength) {
      throw new FormInputError(400, "Ein Formularfeld ist zu lang.");
    }
    fields[field] = value.trim();
  }
  return fields;
}
