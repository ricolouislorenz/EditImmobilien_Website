const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    const value = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");

    process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "Using anon key. If Row Level Security blocks inserts, set SUPABASE_SERVICE_ROLE_KEY and run again."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);
const now = new Date().toISOString();

const activeProperties = [
  ["Stadthaus mit Garten in Lokstedt", "22529 Hamburg-Lokstedt", "€ 749.000", "Reihenhaus", 5, 2, 142],
  ["Helle Eigentumswohnung am Stadtpark", "22303 Hamburg-Winterhude", "€ 489.000", "Eigentumswohnung", 3, 1, 86],
  ["Familienhaus in ruhiger Sackgasse", "25488 Holm", "€ 639.000", "Einfamilienhaus", 5, 2, 156],
  ["Doppelhaushälfte nahe Elbvororten", "22880 Wedel", "€ 699.000", "Doppelhaushälfte", 5, 2, 151],
  ["Penthouse mit zwei Terrassen", "22765 Hamburg-Ottensen", "€ 1.120.000", "Penthouse", 4, 2, 132],
  ["Modernisierte Wohnung in Eimsbüttel", "20259 Hamburg-Eimsbüttel", "€ 529.000", "Eigentumswohnung", 3, 1, 78],
  ["Einfamilienhaus mit Ausbaureserve", "22846 Norderstedt", "€ 585.000", "Einfamilienhaus", 4, 1, 138],
  ["Mehrfamilienhaus als Kapitalanlage", "22045 Hamburg-Tonndorf", "€ 1.450.000", "Mehrfamilienhaus", 10, 4, 386],
  ["Reihenendhaus mit Südgarten", "22559 Hamburg-Rissen", "€ 820.000", "Reihenhaus", 5, 2, 147],
  ["Altbauwohnung mit hohen Decken", "20144 Hamburg-Harvestehude", "€ 785.000", "Eigentumswohnung", 4, 1, 104],
  ["Ladenfläche in frequentierter Lage", "22869 Schenefeld", "€ 398.000", "Ladenfläche", null, 1, 112],
  ["Bungalow auf großem Grundstück", "25462 Rellingen", "€ 675.000", "Einfamilienhaus", 4, 2, 128],
  ["Maisonettewohnung nahe Elbe", "22605 Hamburg-Othmarschen", "€ 895.000", "Eigentumswohnung", 4, 2, 118],
  ["Doppelhaus mit moderner Technik", "25469 Halstenbek", "€ 729.000", "Doppelhaushälfte", 5, 2, 160],
  ["Kompakte Wohnung für Kapitalanleger", "22083 Hamburg-Barmbek-Süd", "€ 289.000", "Eigentumswohnung", 2, 1, 52],
  ["Stilvolles Stadthaus in Altona", "22767 Hamburg-Altona", "€ 930.000", "Reihenhaus", 5, 2, 139],
  ["Einfamilienhaus am Naturschutzgebiet", "25474 Ellerbek", "€ 755.000", "Einfamilienhaus", 6, 2, 174],
  ["Wohn- und Geschäftshaus", "22850 Norderstedt", "€ 1.280.000", "Mehrfamilienhaus", 8, 3, 312],
  ["Penthousewohnung mit Weitblick", "22391 Hamburg-Poppenbüttel", "€ 1.050.000", "Penthouse", 4, 2, 126],
  ["Reihenhaus mit Vollkeller", "22145 Hamburg-Rahlstedt", "€ 549.000", "Reihenhaus", 4, 1, 121],
  ["Neuwertige Wohnung mit Balkon", "22880 Wedel", "€ 465.000", "Eigentumswohnung", 3, 1, 82],
  ["Großzügiges Haus für zwei Generationen", "25451 Quickborn", "€ 890.000", "Einfamilienhaus", 7, 3, 214],
  ["Charmante Doppelhaushälfte in Pinneberg", "25421 Pinneberg", "€ 615.000", "Doppelhaushälfte", 5, 2, 145],
  ["Sanierte Erdgeschosswohnung", "22523 Hamburg-Eidelstedt", "€ 425.000", "Eigentumswohnung", 3, 1, 74],
  ["Mehrfamilienhaus mit sechs Einheiten", "22111 Hamburg-Horn", "€ 1.690.000", "Mehrfamilienhaus", 14, 6, 498],
  ["Einfamilienhaus mit Einliegerbereich", "25436 Tornesch", "€ 720.000", "Einfamilienhaus", 6, 2, 188],
  ["Gewerbefläche mit großer Fensterfront", "22525 Hamburg-Stellingen", "€ 510.000", "Ladenfläche", null, 1, 136],
  ["Wohnung in Wasserlage", "20457 Hamburg-HafenCity", "€ 980.000", "Eigentumswohnung", 3, 2, 96],
  ["Familienfreundliches Reihenmittelhaus", "22457 Hamburg-Schnelsen", "€ 595.000", "Reihenhaus", 4, 1, 116],
  ["Architektenhaus mit offenem Grundriss", "25488 Holm", "€ 1.080.000", "Einfamilienhaus", 5, 2, 201],
];

const referenceProperties = [
  ["Verkauft: Villa im Elbvorort", "22587 Hamburg-Blankenese", "VERKAUFT", "sold", "Einfamilienhaus", 7, 3, 245],
  ["Vermietet: Wohnung in Eppendorf", "20249 Hamburg-Eppendorf", "VERMIETET", "rented", "Eigentumswohnung", 3, 1, 81],
  ["Verkauft: Doppelhaus in Wedel", "22880 Wedel", "VERKAUFT", "sold", "Doppelhaushälfte", 5, 2, 152],
  ["Verkauft: Reihenhaus in Rissen", "22559 Hamburg-Rissen", "VERKAUFT", "sold", "Reihenhaus", 4, 1, 118],
  ["Vermietet: Penthouse in Ottensen", "22765 Hamburg-Ottensen", "VERMIETET", "rented", "Penthouse", 4, 2, 128],
  ["Verkauft: Mehrfamilienhaus in Barmbek", "22083 Hamburg-Barmbek-Süd", "VERKAUFT", "sold", "Mehrfamilienhaus", 12, 5, 432],
  ["Verkauft & vermietet: Wohnhaus in Holm", "25488 Holm", "VERKAUFT & VERMIETET", "sold_and_rented", "Mehrfamilienhaus", 8, 4, 294],
  ["Verkauft: Altbauwohnung in Uhlenhorst", "22085 Hamburg-Uhlenhorst", "VERKAUFT", "sold", "Eigentumswohnung", 4, 1, 109],
  ["Vermietet: Laden in Altona", "22767 Hamburg-Altona", "VERMIETET", "rented", "Ladenfläche", null, 1, 92],
  ["Verkauft: Bungalow in Rellingen", "25462 Rellingen", "VERKAUFT", "sold", "Einfamilienhaus", 4, 2, 134],
  ["Verkauft: Maisonette in Winterhude", "22303 Hamburg-Winterhude", "VERKAUFT", "sold", "Eigentumswohnung", 4, 2, 116],
  ["Vermietet: Reihenhaus in Niendorf", "22453 Hamburg-Niendorf", "VERMIETET", "rented", "Reihenhaus", 5, 2, 143],
  ["Verkauft: Haus am Feldrand", "25474 Ellerbek", "VERKAUFT", "sold", "Einfamilienhaus", 5, 2, 168],
  ["Verkauft: Kapitalanlage in Tonndorf", "22045 Hamburg-Tonndorf", "VERKAUFT", "sold", "Mehrfamilienhaus", 9, 4, 355],
  ["Vermietet: Wohnung in St. Georg", "20099 Hamburg-St. Georg", "VERMIETET", "rented", "Eigentumswohnung", 2, 1, 58],
  ["Verkauft: Doppelhaushälfte in Pinneberg", "25421 Pinneberg", "VERKAUFT", "sold", "Doppelhaushälfte", 5, 2, 149],
  ["Verkauft & vermietet: Gewerbeensemble", "22525 Hamburg-Stellingen", "VERKAUFT & VERMIETET", "sold_and_rented", "Ladenfläche", null, 3, 388],
  ["Verkauft: Stadthaus in Eimsbüttel", "20257 Hamburg-Eimsbüttel", "VERKAUFT", "sold", "Reihenhaus", 5, 2, 137],
  ["Vermietet: Dachgeschoss in Hoheluft", "20253 Hamburg-Hoheluft", "VERMIETET", "rented", "Eigentumswohnung", 3, 1, 73],
  ["Verkauft: Architektenhaus in Quickborn", "25451 Quickborn", "VERKAUFT", "sold", "Einfamilienhaus", 6, 2, 196],
  ["Verkauft: Penthouse in Poppenbüttel", "22391 Hamburg-Poppenbüttel", "VERKAUFT", "sold", "Penthouse", 4, 2, 124],
  ["Vermietet: Ladenfläche in Schenefeld", "22869 Schenefeld", "VERMIETET", "rented", "Ladenfläche", null, 1, 105],
  ["Verkauft: Wohnung in HafenCity", "20457 Hamburg-HafenCity", "VERKAUFT", "sold", "Eigentumswohnung", 3, 2, 98],
  ["Verkauft: Familienhaus in Tornesch", "25436 Tornesch", "VERKAUFT", "sold", "Einfamilienhaus", 5, 2, 176],
  ["Vermietet: Wohnung in Lokstedt", "22529 Hamburg-Lokstedt", "VERMIETET", "rented", "Eigentumswohnung", 2, 1, 64],
  ["Verkauft: Reihenendhaus in Schnelsen", "22457 Hamburg-Schnelsen", "VERKAUFT", "sold", "Reihenhaus", 4, 1, 119],
  ["Verkauft: Mehrfamilienhaus in Horn", "22111 Hamburg-Horn", "VERKAUFT", "sold", "Mehrfamilienhaus", 15, 6, 512],
  ["Vermietet: Townhouse in Othmarschen", "22605 Hamburg-Othmarschen", "VERMIETET", "rented", "Reihenhaus", 5, 2, 144],
  ["Verkauft: Wohnung in Bahrenfeld", "22761 Hamburg-Bahrenfeld", "VERKAUFT", "sold", "Eigentumswohnung", 3, 1, 84],
  ["Verkauft & vermietet: Ensemble in Norderstedt", "22846 Norderstedt", "VERKAUFT & VERMIETET", "sold_and_rented", "Mehrfamilienhaus", 11, 5, 406],
];

function makeId(group, index) {
  return `00000000-0000-4000-8000-${group}${String(index).padStart(9, "0")}`;
}

function toProperty(row, index, status = "active") {
  const [title, location, price, type, bedrooms, bathrooms, area] = row;

  return {
    id: makeId(status === "active" ? "100" : "200", index + 1),
    title,
    location,
    price,
    type,
    status,
    bedrooms,
    bathrooms,
    area,
    area_label: null,
    images: [],
    sort_order: index + 1,
    created_at: now,
    updated_at: now,
  };
}

function toReferenceProperty(row, index) {
  const [title, location, price, status, type, bedrooms, bathrooms, area] = row;

  return {
    id: makeId("200", index + 1),
    title,
    location,
    price,
    type,
    status,
    bedrooms,
    bathrooms,
    area,
    area_label: null,
    images: [],
    sort_order: index + 1,
    created_at: now,
    updated_at: now,
  };
}

async function main() {
  const properties = [
    ...activeProperties.map((row, index) => toProperty(row, index)),
    ...referenceProperties.map((row, index) => toReferenceProperty(row, index)),
  ];

  const ids = properties.map((property) => property.id);
  const { data: existingProperties, error: readError } = await supabase
    .from("properties")
    .select("id")
    .in("id", ids);

  if (readError) throw readError;

  const existingIds = new Set((existingProperties ?? []).map((property) => property.id));
  const missingProperties = properties.filter((property) => !existingIds.has(property.id));

  if (missingProperties.length === 0) {
    console.log("All seed properties already exist. Nothing to insert.");
    return;
  }

  const { error } = await supabase
    .from("properties")
    .insert(missingProperties);

  if (error) throw error;

  const insertedActiveCount = missingProperties.filter(
    (property) => property.status === "active"
  ).length;
  const insertedReferenceCount = missingProperties.length - insertedActiveCount;

  console.log(`Inserted ${insertedActiveCount} active properties.`);
  console.log(`Inserted ${insertedReferenceCount} reference properties.`);
  console.log(`Skipped ${existingIds.size} existing seed properties.`);
}

main().catch((error) => {
  console.error("Property seed failed:");
  console.error(error);
  process.exit(1);
});
