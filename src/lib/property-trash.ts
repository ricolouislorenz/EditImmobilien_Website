export interface TrashedProperty {
  property_id: string;
  snapshot: { title?: string; reference?: string };
  deleted_at: string;
  expires_at: string;
}

/** ÜBERGABE ADMIN-04: Ohne passende Bestätigung bleibt der Eintrag sichtbar. */
export async function confirmPropertyAction(
  operation: () => PromiseLike<{ data: { id: string } | null; error: unknown }>,
  propertyId: string,
): Promise<void> {
  try {
    const { data, error } = await operation();
    if (error || data?.id !== propertyId) throw new Error();
  } catch {
    throw new Error("Die Änderung wurde nicht bestätigt. Bitte die Übersicht neu laden und den tatsächlichen Stand prüfen. Möglicherweise wurde der Eintrag inzwischen geändert oder deine Anmeldung ist abgelaufen.");
  }
}
