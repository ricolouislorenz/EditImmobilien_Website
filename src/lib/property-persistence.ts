import type { PropertyInput } from "../types/property.ts";

/** Ein gemeinsamer Serveraufruf für Positionsänderung und Datensatz, ohne Rückfall auf den alten Ablauf. */
export function persistPropertyAtomically(
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<{
    data: { id: string } | null;
    error: unknown;
  }>,
  propertyId: string,
  isNew: boolean,
  property: PropertyInput,
) {
  return rpc("save_property", { p_id: propertyId, p_is_new: isNew, p_property: property });
}
