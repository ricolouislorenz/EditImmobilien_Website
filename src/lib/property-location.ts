/** ÜBERGABE: Beim Ausblenden von „Hamburg“ den Abstand zwischen PLZ und Ort erhalten. */
export function formatPropertyLocation(location: string): string {
  return location
    .replace(/(,?\s*Hamburg\s*,?\s*)/gi, " ")
    .trim()
    .replace(/^(\d{5})\s*(?=\S)/u, "$1 ")
    .replace(/\s+/g, " ");
}
