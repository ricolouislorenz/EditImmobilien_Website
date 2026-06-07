export type PropertyStatus = "active" | "sold" | "rented" | "sold_and_rented";

export type PropertyType =
  | "Einfamilienhaus"
  | "Doppelhaushälfte"
  | "Reihenhaus"
  | "Eigentumswohnung"
  | "Mehrfamilienhaus"
  | "Penthouse"
  | "Ladenfläche"
  | "Sonstiges";

export interface Property {
  id: string;
  /** Fortlaufende, menschenlesbare Objektnummer, z. B. "EI-005". Nur intern/in Mails sichtbar. */
  reference: string;
  title: string;
  location: string;
  /** Anzeigepreis, z. B. "€ 595.000" oder "VERKAUFT" */
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  /** Freitext für Sonderfälle, z. B. "923 Wohnfläche + 385 Gewerbe" */
  area_label: string | null;
  type: PropertyType | string;
  status: PropertyStatus;
  /** Array von Supabase-Storage-URLs */
  images: string[];
  /** Manuelle Sortierreihenfolge */
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Eingabetyp für das Anlegen/Bearbeiten einer Immobilie im Admin-Panel.
 *  `reference` ist ausgenommen, weil die Objektnummer fortlaufend von der Datenbank vergeben wird. */
export type PropertyInput = Omit<
  Property,
  "id" | "reference" | "created_at" | "updated_at"
>;
