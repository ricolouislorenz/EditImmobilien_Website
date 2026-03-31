import { useState } from "react";
import { Calculator, TrendingUp, Home, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";

// PLZ-basierte Quadratmeterpreise für Hamburg und Umgebung
// Quelle: ImmoScout24, Immowelt, Gutachterausschuss Hamburg 2025 (Richtwerte, Stand 2025)
const PLZ_PREISE: Record<string, { name: string; preis: number }> = {
  // === HAMBURG MITTE ===
  "20095": { name: "Hamburg Altstadt", preis: 7000 },
  "20097": { name: "Hamburg Hammerbrook", preis: 5500 },
  "20099": { name: "Hamburg St. Georg", preis: 6500 },
  "20354": { name: "Hamburg Neustadt", preis: 6500 },
  "20355": { name: "Hamburg Neustadt", preis: 6200 },
  "20357": { name: "Hamburg St. Pauli", preis: 5800 },
  "20359": { name: "Hamburg St. Pauli", preis: 5600 },
  "20457": { name: "Hamburg HafenCity", preis: 8500 },
  "20459": { name: "Hamburg Neustadt", preis: 6000 },
  "20535": { name: "Hamburg Hamm-Nord", preis: 5000 },
  "20537": { name: "Hamburg Hamm-Mitte", preis: 4900 },
  "20539": { name: "Hamburg Hamm-Süd", preis: 4800 },

  // === EIMSBÜTTEL ===
  "20144": { name: "Hamburg Eimsbüttel", preis: 6200 },
  "20146": { name: "Hamburg Rotherbaum", preis: 8500 },
  "20148": { name: "Hamburg Harvestehude", preis: 9000 },
  "20149": { name: "Hamburg Harvestehude", preis: 8800 },
  "20249": { name: "Hamburg Eppendorf", preis: 7000 },
  "20251": { name: "Hamburg Eppendorf", preis: 7000 },
  "20253": { name: "Hamburg Hoheluft-West", preis: 6800 },
  "20255": { name: "Hamburg Eimsbüttel", preis: 6000 },
  "20257": { name: "Hamburg Eimsbüttel", preis: 6000 },
  "20259": { name: "Hamburg Eimsbüttel", preis: 6200 },
  "22523": { name: "Hamburg Eidelstedt", preis: 4500 },
  "22525": { name: "Hamburg Stellingen", preis: 4500 },
  "22527": { name: "Hamburg Stellingen", preis: 4500 },
  "22529": { name: "Hamburg Lokstedt", preis: 5500 },

  // === ALTONA ===
  "22761": { name: "Hamburg Bahrenfeld", preis: 5200 },
  "22763": { name: "Hamburg Ottensen", preis: 6500 },
  "22765": { name: "Hamburg Altona-Altstadt", preis: 5800 },
  "22767": { name: "Hamburg Altona-Nord", preis: 5800 },
  "22769": { name: "Hamburg Bahrenfeld", preis: 5000 },
  "22547": { name: "Hamburg Lurup", preis: 4200 },
  "22549": { name: "Hamburg Lurup", preis: 4200 },
  "22559": { name: "Hamburg Rissen", preis: 6500 },
  "22587": { name: "Hamburg Blankenese", preis: 8800 },
  "22589": { name: "Hamburg Sülldorf", preis: 6200 },
  "22605": { name: "Hamburg Osdorf", preis: 5000 },
  "22607": { name: "Hamburg Groß Flottbek", preis: 7000 },
  "22609": { name: "Hamburg Nienstedten", preis: 8000 },

  // === HAMBURG-NORD ===
  "22081": { name: "Hamburg Barmbek-Nord", preis: 4700 },
  "22083": { name: "Hamburg Barmbek-Süd", preis: 4700 },
  "22085": { name: "Hamburg Uhlenhorst", preis: 6800 },
  "22087": { name: "Hamburg Hohenfelde", preis: 6200 },
  "22089": { name: "Hamburg Eilbek", preis: 5500 },
  "22297": { name: "Hamburg Alsterdorf", preis: 5500 },
  "22299": { name: "Hamburg Groß Borstel", preis: 5200 },
  "22301": { name: "Hamburg Winterhude", preis: 7500 },
  "22303": { name: "Hamburg Winterhude", preis: 7500 },
  "22305": { name: "Hamburg Barmbek-Nord", preis: 4700 },
  "22307": { name: "Hamburg Barmbek-Süd", preis: 4700 },
  "22309": { name: "Hamburg Steilshoop", preis: 4200 },
  "22335": { name: "Hamburg Fuhlsbüttel", preis: 5000 },
  "22337": { name: "Hamburg Ohlsdorf", preis: 5200 },
  "22339": { name: "Hamburg Hummelsbüttel", preis: 4800 },
  "22415": { name: "Hamburg Langenhorn", preis: 4500 },
  "22417": { name: "Hamburg Langenhorn", preis: 4500 },
  "22419": { name: "Hamburg Langenhorn", preis: 4500 },
  "22453": { name: "Hamburg Niendorf", preis: 5200 },
  "22455": { name: "Hamburg Niendorf", preis: 5000 },
  "22457": { name: "Hamburg Schnelsen", preis: 4800 },
  "22459": { name: "Hamburg Schnelsen", preis: 4800 },

  // === WANDSBEK ===
  "22041": { name: "Hamburg Marienthal", preis: 5000 },
  "22043": { name: "Hamburg Jenfeld", preis: 4300 },
  "22045": { name: "Hamburg Tonndorf", preis: 4400 },
  "22047": { name: "Hamburg Wandsbek", preis: 4600 },
  "22049": { name: "Hamburg Dulsberg", preis: 4500 },
  "22111": { name: "Hamburg Horn", preis: 4500 },
  "22113": { name: "Hamburg Billstedt", preis: 4000 },
  "22115": { name: "Hamburg Billstedt", preis: 4000 },
  "22117": { name: "Hamburg Billstedt", preis: 3900 },
  "22119": { name: "Hamburg Horn", preis: 4500 },
  "22143": { name: "Hamburg Rahlstedt", preis: 3800 },
  "22145": { name: "Hamburg Rahlstedt", preis: 3800 },
  "22147": { name: "Hamburg Rahlstedt", preis: 3800 },
  "22149": { name: "Hamburg Rahlstedt", preis: 3700 },
  "22159": { name: "Hamburg Farmsen-Berne", preis: 4500 },
  "22177": { name: "Hamburg Bramfeld", preis: 4500 },
  "22179": { name: "Hamburg Bramfeld", preis: 4500 },
  "22359": { name: "Hamburg Volksdorf", preis: 5500 },
  "22391": { name: "Hamburg Wellingsbüttel", preis: 5200 },
  "22393": { name: "Hamburg Sasel", preis: 4800 },
  "22395": { name: "Hamburg Bergstedt", preis: 5000 },
  "22397": { name: "Hamburg Duvenstedt", preis: 5000 },
  "22399": { name: "Hamburg Poppenbüttel", preis: 5200 },

  // === BERGEDORF ===
  "21029": { name: "Hamburg Lohbrügge", preis: 4200 },
  "21031": { name: "Hamburg Lohbrügge", preis: 4200 },
  "21033": { name: "Hamburg Bergedorf", preis: 4400 },
  "21035": { name: "Hamburg Neuallermöhe", preis: 4200 },
  "21037": { name: "Hamburg Kirchwerder", preis: 3500 },
  "21039": { name: "Hamburg Neuengamme", preis: 3500 },

  // === HARBURG ===
  "21073": { name: "Hamburg Harburg", preis: 4200 },
  "21075": { name: "Hamburg Harburg", preis: 4000 },
  "21077": { name: "Hamburg Eißendorf", preis: 4000 },
  "21079": { name: "Hamburg Wilstorf", preis: 3900 },
  "21107": { name: "Hamburg Wilhelmsburg", preis: 4000 },
  "21109": { name: "Hamburg Wilhelmsburg", preis: 3800 },
  "21129": { name: "Hamburg Finkenwerder", preis: 4200 },
  "21147": { name: "Hamburg Neugraben-Fischbek", preis: 3800 },
  "21149": { name: "Hamburg Hausbruch", preis: 3700 },

  // === NORDERSTEDT ===
  "22844": { name: "Norderstedt", preis: 4100 },
  "22846": { name: "Norderstedt", preis: 4100 },
  "22848": { name: "Norderstedt", preis: 4000 },
  "22850": { name: "Norderstedt", preis: 4100 },

  // === WEITERES UMLAND ===
  "22869": { name: "Schenefeld", preis: 4000 },
  "22880": { name: "Wedel", preis: 3700 },
  "22885": { name: "Barsbüttel", preis: 3800 },
  "22926": { name: "Ahrensburg", preis: 4400 },
  "22941": { name: "Bargteheide", preis: 3600 },
  "21465": { name: "Reinbek", preis: 4200 },
  "21502": { name: "Geesthacht", preis: 3200 },
  "25335": { name: "Elmshorn", preis: 3000 },
  "25337": { name: "Elmshorn", preis: 3000 },
  "25358": { name: "Horst", preis: 3500 },
  "25421": { name: "Pinneberg", preis: 3300 },
  "25436": { name: "Uetersen", preis: 3200 },
  "25451": { name: "Quickborn", preis: 3600 },
  "25462": { name: "Rellingen", preis: 4000 },
  "25469": { name: "Halstenbek", preis: 4300 },
  "25488": { name: "Holm", preis: 3700 },
};

const ZUSTAND_FAKTOREN: Record<string, number> = {
  neuwertig: 1.25,
  gut: 1.0,
  renovierungsbedarf: 0.75,
  sanierungsbedarf: 0.6,
};

const OBJEKTTYP_FAKTOREN: Record<string, number> = {
  einfamilienhaus: 1.0,
  reihenhaus: 0.92,
  doppelhälfte: 0.95,
  eigentumswohnung: 0.88,
  mehrfamilienhaus: 1.1,
};

function extractPLZ(address: string): string | null {
  const match = address.match(/\b(\d{5})\b/);
  return match ? match[1] : null;
}

function getBasispreis(address: string): number {
  const plz = extractPLZ(address);
  if (plz && PLZ_PREISE[plz]) return PLZ_PREISE[plz].preis;

  const lower = address.toLowerCase();
  if (lower.includes("harvestehude") || lower.includes("rotherbaum")) return 9000;
  if (lower.includes("hafencity")) return 8500;
  if (lower.includes("blankenese")) return 8800;
  if (lower.includes("nienstedten")) return 8000;
  if (lower.includes("winterhude")) return 7500;
  if (lower.includes("eppendorf")) return 7000;
  if (lower.includes("groß flottbek") || lower.includes("gross flottbek")) return 7000;
  if (lower.includes("uhlenhorst")) return 6800;
  if (lower.includes("rissen") || lower.includes("sülldorf")) return 6500;
  if (lower.includes("ottensen")) return 6500;
  if (lower.includes("altona")) return 5800;
  if (lower.includes("lokstedt")) return 5500;
  if (lower.includes("osdorf")) return 5000;
  if (lower.includes("niendorf")) return 5000;
  if (lower.includes("harburg") || lower.includes("wilhelmsburg")) return 4000;
  if (lower.includes("bergedorf")) return 4400;
  if (lower.includes("rahlstedt")) return 3800;
  if (lower.includes("billstedt")) return 4000;
  if (lower.includes("ahrensburg")) return 4400;
  if (lower.includes("reinbek")) return 4200;
  if (lower.includes("schenefeld")) return 4000;
  if (lower.includes("norderstedt")) return 4100;
  if (lower.includes("halstenbek")) return 4300;
  if (lower.includes("rellingen")) return 4000;
  if (lower.includes("wedel")) return 3700;
  if (lower.includes("quickborn")) return 3600;
  if (lower.includes("holm")) return 3700;
  if (lower.includes("pinneberg")) return 3300;
  if (lower.includes("elmshorn")) return 3000;
  if (lower.includes("hamburg")) return 5500;
  return 4500;
}

function getOrtsname(address: string): string {
  const plz = extractPLZ(address);
  if (plz && PLZ_PREISE[plz]) return PLZ_PREISE[plz].name;

  const lower = address.toLowerCase();
  if (lower.includes("harvestehude")) return "Hamburg Harvestehude";
  if (lower.includes("rotherbaum")) return "Hamburg Rotherbaum";
  if (lower.includes("hafencity")) return "Hamburg HafenCity";
  if (lower.includes("blankenese")) return "Hamburg Blankenese";
  if (lower.includes("winterhude")) return "Hamburg Winterhude";
  if (lower.includes("eppendorf")) return "Hamburg Eppendorf";
  if (lower.includes("altona")) return "Hamburg Altona";
  if (lower.includes("ottensen")) return "Hamburg Ottensen";
  if (lower.includes("harburg")) return "Hamburg Harburg";
  if (lower.includes("wilhelmsburg")) return "Hamburg Wilhelmsburg";
  if (lower.includes("bergedorf")) return "Hamburg Bergedorf";
  if (lower.includes("ahrensburg")) return "Ahrensburg";
  if (lower.includes("reinbek")) return "Reinbek";
  if (lower.includes("schenefeld")) return "Schenefeld";
  if (lower.includes("norderstedt")) return "Norderstedt";
  if (lower.includes("halstenbek")) return "Halstenbek";
  if (lower.includes("wedel")) return "Wedel";
  if (lower.includes("quickborn")) return "Quickborn";
  if (lower.includes("holm")) return "Holm";
  if (lower.includes("pinneberg")) return "Pinneberg";
  if (lower.includes("elmshorn")) return "Elmshorn";
  if (lower.includes("hamburg")) return "Hamburg";
  return "Hamburg & Umgebung";
}

function getAlterFaktor(baujahr: number): number {
  const alter = new Date().getFullYear() - baujahr;
  if (alter < 5) return 1.15;
  if (alter < 15) return 1.05;
  if (alter < 30) return 1.0;
  if (alter < 50) return 0.9;
  return 0.8;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ImmobilienwertRechner() {
  const [objekttyp, setObjekttyp] = useState("einfamilienhaus");
  const [wohnflaeche, setWohnflaeche] = useState(120);
  const [zimmer, setZimmer] = useState(4);
  const [baeder, setBaeder] = useState(1);
  const [baujahr, setBaujahr] = useState(1995);
  const [zustand, setZustand] = useState("gut");
  const [adresse, setAdresse] = useState("");

  // Zimmer: wenige Zimmer senken, viele erhöhen den Wert leicht
  const zimmerFaktor =
    zimmer <= 1 ? 0.93
    : zimmer === 2 ? 0.97
    : zimmer === 3 ? 1.0
    : zimmer === 4 ? 1.02
    : zimmer === 5 ? 1.04
    : 1.05;

  // Bäder: zweites Bad erhöht den Wert spürbar
  const baederFaktor = baeder === 1 ? 1.0 : baeder === 2 ? 1.03 : 1.05;

  const basispreis = getBasispreis(adresse);
  const rohwert =
    wohnflaeche *
    basispreis *
    (OBJEKTTYP_FAKTOREN[objekttyp] ?? 1) *
    ZUSTAND_FAKTOREN[zustand] *
    getAlterFaktor(baujahr) *
    zimmerFaktor *
    baederFaktor;

  const wert = {
    min: Math.round((rohwert * 0.9) / 1000) * 1000,
    mittel: Math.round(rohwert / 1000) * 1000,
    max: Math.round((rohwert * 1.1) / 1000) * 1000,
  };

  const preisProQm = basispreis;
  const ortsname = adresse.trim() ? getOrtsname(adresse) : "Hamburg & Umgebung";

  return (
    <section id="wertrechner" className="py-20 bg-gradient-to-b from-[#111111] to-[#111111]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6B4F3A]/10 border border-[#6B4F3A]/20 px-4 py-2 rounded-full mb-4">
            <Calculator className="w-4 h-4 text-[#6B4F3A]" />
            <span className="text-[#6B4F3A] text-sm">Kostenlos & unverbindlich</span>
          </div>
          <h2 className="text-white mb-4">Was ist Ihre Immobilie wert?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ermitteln Sie sofort eine erste Werteinschätzung — der Rechner aktualisiert
            sich live bei jeder Eingabe.
          </p>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* Eingaben */}
            <div className="p-8 md:p-10 space-y-8 border-b md:border-b-0 md:border-r border-white/10">

              {/* Objekttyp */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Objekttyp</label>
                <select
                  value={objekttyp}
                  onChange={(e) => setObjekttyp(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6B4F3A] transition-colors"
                >
                  <option value="einfamilienhaus">Einfamilienhaus</option>
                  <option value="reihenhaus">Reihenhaus</option>
                  <option value="doppelhälfte">Doppelhaushälfte</option>
                  <option value="eigentumswohnung">Eigentumswohnung</option>
                  <option value="mehrfamilienhaus">Mehrfamilienhaus</option>
                </select>
              </div>

              {/* Wohnfläche */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#C2A878]" />
                    Wohnfläche
                  </label>
                  <span className="text-[#6B4F3A] font-medium">{wohnflaeche} m²</span>
                </div>
                <Slider
                  value={[wohnflaeche]}
                  onValueChange={(v) => setWohnflaeche(v[0])}
                  min={30}
                  max={500}
                  step={5}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>30 m²</span><span>500 m²</span>
                </div>
              </div>

              {/* Zimmer & Bäder */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-400">Zimmer</label>
                    <span className="text-[#6B4F3A] font-medium">{zimmer}</span>
                  </div>
                  <Slider
                    value={[zimmer]}
                    onValueChange={(v) => setZimmer(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>1</span><span>10</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-400">Badezimmer</label>
                    <span className="text-[#6B4F3A] font-medium">{baeder}</span>
                  </div>
                  <Slider
                    value={[baeder]}
                    onValueChange={(v) => setBaeder(v[0])}
                    min={1}
                    max={4}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>1</span><span>4</span>
                  </div>
                </div>
              </div>

              {/* Baujahr */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-gray-400">Baujahr</label>
                  <span className="text-[#6B4F3A] font-medium">{baujahr}</span>
                </div>
                <Slider
                  value={[baujahr]}
                  onValueChange={(v) => setBaujahr(v[0])}
                  min={1900}
                  max={2025}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1900</span><span>2025</span>
                </div>
              </div>

              {/* Zustand */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Zustand</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "neuwertig", label: "Neuwertig" },
                    { value: "gut", label: "Gut gepflegt" },
                    { value: "renovierungsbedarf", label: "Renovierungsbedarf" },
                    { value: "sanierungsbedarf", label: "Sanierungsbedarf" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setZustand(opt.value)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        zustand === opt.value
                          ? "bg-[#6B4F3A]/20 border-[#6B4F3A] text-[#6B4F3A]"
                          : "bg-[#1a1a1a] border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lage */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C2A878]" />
                  Lage (PLZ oder Adresse)
                </label>
                <Input
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="z. B. 22880 oder Hamburg Wedel"
                  className="bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-[#6B4F3A]"
                />
              </div>
            </div>

            {/* Ergebnis */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-4 h-4 text-[#6B4F3A]" />
                  <span className="text-sm text-gray-400">Geschätzter Marktwert</span>
                </div>

                {/* Preisspanne mit Mittelwert */}
                <div className="mb-6">
                  {/* Werte über dem Balken */}
                  <div className="flex items-end justify-between mb-3">
                    <div className="text-left">
                      <div className="text-xs text-gray-600 mb-1">Minimum</div>
                      <div className="text-base text-gray-400 font-medium">
                        {formatCurrency(wert.min)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#6B4F3A] mb-1 font-medium">Mittelwert</div>
                      <div className="text-3xl md:text-4xl font-bold text-white leading-none">
                        {formatCurrency(wert.mittel)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 mb-1">Maximum</div>
                      <div className="text-base text-gray-400 font-medium">
                        {formatCurrency(wert.max)}
                      </div>
                    </div>
                  </div>

                  {/* Balken */}
                  <div className="relative h-1.5 bg-white/10 rounded-full">
                    <div className="absolute inset-y-0 left-[9%] right-[9%] bg-gradient-to-r from-[#C2A878]/50 via-[#6B4F3A] to-[#C2A878]/50 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#6B4F3A] rounded-full border-2 border-[#0d0d0d] shadow-md shadow-[#6B4F3A]/50" />
                  </div>
                </div>

                {/* Kennzahlen */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Ø Marktpreis / m²</div>
                    <div className="text-white font-semibold">{formatCurrency(preisProQm)}</div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Lage</div>
                    <div className="text-white font-semibold text-sm leading-tight">{ortsname}</div>
                  </div>
                </div>

                {/* Hinweis */}
                <p className="text-xs text-gray-600 mb-8 leading-relaxed">
                  Richtwert auf Basis von Lage, Fläche, Baujahr und Zustand. Marktentwicklungen
                  und individuelle Merkmale können den tatsächlichen Wert beeinflussen.
                </p>
              </div>

              {/* CTA */}
              <a href="#kontakt">
                <Button className="w-full bg-[#6B4F3A] hover:bg-[#5A4230] text-white py-6 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#6B4F3A]/20">
                  Kostenlose Bewertung anfragen
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Trust-Elemente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { wert: "100%", label: "Kostenlos & unverbindlich" },
            { wert: "180+", label: "Bewertete Immobilien" },
            { wert: "13+", label: "Jahre Markterfahrung" },
          ].map((item) => (
            <div key={item.label} className="text-center py-5 px-4 bg-white/[0.03] border border-white/5 rounded-xl">
              <div className="text-2xl font-bold text-[#6B4F3A] mb-1">{item.wert}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
