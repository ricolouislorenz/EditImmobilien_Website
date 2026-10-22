import type { Property } from "../types/property.ts";

export type PositionProperty = Pick<Property, "id" | "title" | "status" | "sort_order">;

/** Sichtbare Plätze zählen je Website-Bereich; interne Sortierwerte dürfen Lücken haben. */
export function positionSiblings(properties: PositionProperty[], status: string): PositionProperty[] {
  return properties.filter((p) => (p.status === "active") === (status === "active"))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function visiblePosition(properties: PositionProperty[], sortOrder: number): number {
  return properties.filter((p) => p.sort_order < sortOrder).length + 1;
}

/** Vor dem nächsten Objekt einfügen; die gemeinsame Speicherfunktion verschiebt es bei Bedarf. */
export function sortOrderForPosition(properties: PositionProperty[], position: number): number {
  const index = Math.max(0, Math.min(properties.length, Math.trunc(position) - 1));
  return properties[index]?.sort_order ?? Math.max(0, ...properties.map((p) => p.sort_order + 1));
}
