import { useState } from "react";
import { Calculator, TrendingUp, Home, MapPin, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";

export function ImmobilienwertRechner() {
  const [objekttyp, setObjekttyp] = useState("einfamilienhaus");
  const [wohnflaeche, setWohnflaeche] = useState(100);
  const [zimmer, setZimmer] = useState(3);
  const [baujahr, setBaujahr] = useState(1990);
  const [zustand, setZustand] = useState("gut");
  const [adresse, setAdresse] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Erweiterte PLZ-basierte Quadratmeterpreise für Hamburg und Umgebung
  const plzPreise: Record<string, { name: string; preis: number }> = {
    // Hamburg Zentrum & Altstadt
    "20095": { name: "Hamburg Altstadt", preis: 7500 },
    "20097": { name: "Hamburg Hammerbrook", preis: 6000 },
    "20099": { name: "Hamburg St. Georg", preis: 6500 },
    
    // Hamburg Eimsbüttel & Rotherbaum
    "20144": { name: "Hamburg Eimsbüttel", preis: 6800 },
    "20146": { name: "Hamburg Rotherbaum", preis: 7200 },
    "20148": { name: "Hamburg Harvestehude", preis: 8500 },
    
    // Hamburg Eppendorf & Winterhude
    "20249": { name: "Hamburg Eppendorf", preis: 7000 },
    "20251": { name: "Hamburg Eppendorf", preis: 7200 },
    "20253": { name: "Hamburg Winterhude", preis: 6800 },
    
    // Hamburg Altona
    "22765": { name: "Hamburg Altona-Altstadt", preis: 6200 },
    "22767": { name: "Hamburg Altona-Nord", preis: 6000 },
    "22769": { name: "Hamburg Bahrenfeld", preis: 5800 },
    
    // Hamburg Blankenese & Nienstedten
    "22587": { name: "Hamburg Blankenese", preis: 8000 },
    "22589": { name: "Hamburg Blankenese", preis: 7800 },
    "22605": { name: "Hamburg Osdorf", preis: 5500 },
    
    // Wedel
    "22880": { name: "Wedel", preis: 4200 },
    
    // Holm
    "25488": { name: "Holm", preis: 4000 },
    
    // Norderstedt
    "22844": { name: "Norderstedt", preis: 4300 },
    "22846": { name: "Norderstedt", preis: 4300 },
    "22848": { name: "Norderstedt", preis: 4200 },
    
    // Quickborn
    "25451": { name: "Quickborn", preis: 3800 },
    
    // Pinneberg
    "25421": { name: "Pinneberg", preis: 3900 },
    
    // Weitere Hamburg PLZ
    "20257": { name: "Hamburg Eimsbüttel", preis: 6500 },
    "20259": { name: "Hamburg Eppendorf", preis: 6800 },
    "21029": { name: "Hamburg Bergedorf", preis: 4500 },
    "21031": { name: "Hamburg Lohbrügge", preis: 4200 },
    "21033": { name: "Hamburg Bergedorf", preis: 4400 },
    "21035": { name: "Hamburg Neuallermöhe", preis: 4300 },
    "22041": { name: "Hamburg Wandsbek", preis: 5000 },
    "22043": { name: "Hamburg Jenfeld", preis: 4500 },
    "22045": { name: "Hamburg Tonndorf", preis: 4600 },
    "22047": { name: "Hamburg Wandsbek", preis: 5100 },
    "22049": { name: "Hamburg Dulsberg", preis: 5200 },
    "22081": { name: "Hamburg Barmbek", preis: 5500 },
    "22083": { name: "Hamburg Barmbek", preis: 5400 },
    "22085": { name: "Hamburg Uhlenhorst", preis: 6500 },
    "22087": { name: "Hamburg Hohenfelde", preis: 6000 },
    "22089": { name: "Hamburg Eilbek", preis: 5800 },
    "22111": { name: "Hamburg Horn", preis: 4800 },
    "22113": { name: "Hamburg Billstedt", preis: 4200 },
    "22115": { name: "Hamburg Billstedt", preis: 4100 },
    "22117": { name: "Hamburg Billstedt", preis: 4000 },
    "22119": { name: "Hamburg Horn", preis: 4700 },
    "22143": { name: "Hamburg Rahlstedt", preis: 4500 },
    "22145": { name: "Hamburg Rahlstedt", preis: 4600 },
    "22147": { name: "Hamburg Rahlstedt", preis: 4500 },
    "22149": { name: "Hamburg Rahlstedt", preis: 4400 },
    "22159": { name: "Hamburg Farmsen", preis: 4700 },
    "22301": { name: "Hamburg Winterhude", preis: 6800 },
    "22303": { name: "Hamburg Winterhude", preis: 6900 },
    "22305": { name: "Hamburg Barmbek", preis: 5600 },
    "22307": { name: "Hamburg Barmbek", preis: 5500 },
    "22309": { name: "Hamburg Steilshoop", preis: 4500 },
    "22335": { name: "Hamburg Fuhlsbüttel", preis: 5000 },
    "22337": { name: "Hamburg Ohlsdorf", preis: 5200 },
    "22339": { name: "Hamburg Hummelsbüttel", preis: 5100 },
    "22359": { name: "Hamburg Volksdorf", preis: 5800 },
    "22391": { name: "Hamburg Poppenbüttel", preis: 5500 },
    "22393": { name: "Hamburg Sasel", preis: 5400 },
    "22395": { name: "Hamburg Bergstedt", preis: 5600 },
    "22397": { name: "Hamburg Duvenstedt", preis: 5300 },
    "22399": { name: "Hamburg Poppenbüttel", preis: 5500 },
    "22415": { name: "Hamburg Langenhorn", preis: 4800 },
    "22417": { name: "Hamburg Langenhorn", preis: 4700 },
    "22419": { name: "Hamburg Langenhorn", preis: 4600 },
    "22453": { name: "Hamburg Niendorf", preis: 5500 },
    "22455": { name: "Hamburg Niendorf", preis: 5400 },
    "22457": { name: "Hamburg Schnelsen", preis: 5000 },
    "22459": { name: "Hamburg Schnelsen", preis: 4900 },
    "22523": { name: "Hamburg Eidelstedt", preis: 4500 },
    "22525": { name: "Hamburg Stellingen", preis: 4800 },
    "22527": { name: "Hamburg Stellingen", preis: 4700 },
    "22529": { name: "Hamburg Lokstedt", preis: 5200 },
    "22547": { name: "Hamburg Lurup", preis: 4300 },
    "22549": { name: "Hamburg Lurup", preis: 4200 },
    "22559": { name: "Hamburg Rissen", preis: 6500 },
    "22587": { name: "Hamburg Blankenese", preis: 8000 },
    "22589": { name: "Hamburg Sülldorf", preis: 6000 },
    "22605": { name: "Hamburg Osdorf", preis: 5500 },
    "22607": { name: "Hamburg Groß Flottbek", preis: 6800 },
    "22609": { name: "Hamburg Nienstedten", preis: 7500 },
  };

  // Extrahiere PLZ aus Adresse
  const extractPLZ = (address: string): string | null => {
    const plzMatch = address.match(/\b(\d{5})\b/);
    return plzMatch ? plzMatch[1] : null;
  };

  // Ermittle Preis basierend auf PLZ
  const getPreisFromAdresse = (address: string): number => {
    const plz = extractPLZ(address);
    
    if (plz && plzPreise[plz]) {
      return plzPreise[plz].preis;
    }
    
    // Fallback: Prüfe ob Hamburg in Adresse vorkommt
    const addressLower = address.toLowerCase();
    if (addressLower.includes("hamburg")) {
      return 5500; // Durchschnittspreis Hamburg
    }
    if (addressLower.includes("wedel")) {
      return 4200;
    }
    if (addressLower.includes("holm")) {
      return 4000;
    }
    if (addressLower.includes("norderstedt")) {
      return 4300;
    }
    if (addressLower.includes("quickborn")) {
      return 3800;
    }
    if (addressLower.includes("pinneberg")) {
      return 3900;
    }
    
    // Standard-Fallback für Hamburg-Umgebung
    return 4500;
  };

  // Ermittle Ortsname basierend auf Adresse
  const getOrtsnameFromAdresse = (address: string): string => {
    const plz = extractPLZ(address);
    
    if (plz && plzPreise[plz]) {
      return plzPreise[plz].name;
    }
    
    const addressLower = address.toLowerCase();
    if (addressLower.includes("hamburg")) return "Hamburg";
    if (addressLower.includes("wedel")) return "Wedel";
    if (addressLower.includes("holm")) return "Holm";
    if (addressLower.includes("norderstedt")) return "Norderstedt";
    if (addressLower.includes("quickborn")) return "Quickborn";
    if (addressLower.includes("pinneberg")) return "Pinneberg";
    
    return "Hamburg Umgebung";
  };

  // Zustandsfaktoren
  const zustandFaktoren: Record<string, number> = {
    neuwertig: 1.25,
    gut: 1.0,
    renovierungsbedarf: 0.75,
    sanierungsbedarf: 0.6,
  };

  // Alterbewertung
  const getAlterFaktor = (jahr: number) => {
    const alter = 2025 - jahr;
    if (alter < 5) return 1.15;
    if (alter < 15) return 1.05;
    if (alter < 30) return 1.0;
    if (alter < 50) return 0.9;
    return 0.8;
  };

  const berechneWert = () => {
    const basisPreis = getPreisFromAdresse(adresse);
    const zustandFaktor = zustandFaktoren[zustand];
    const alterFaktor = getAlterFaktor(baujahr);
    
    const geschaetzterWert = wohnflaeche * basisPreis * zustandFaktor * alterFaktor;
    
    return {
      min: Math.round(geschaetzterWert * 0.9 / 1000) * 1000,
      max: Math.round(geschaetzterWert * 1.1 / 1000) * 1000,
      mittel: Math.round(geschaetzterWert / 1000) * 1000,
    };
  };

  const handleBerechnen = () => {
    setShowResult(true);
  };

  const wert = berechneWert();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="wertrechner" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#A2694A]/10 px-4 py-2 rounded-full mb-4">
            <Calculator className="w-5 h-5 text-[#A2694A]" />
            <span className="text-[#A2694A]">Kostenlos & unverbindlich</span>
          </div>
          <h2 className="text-white mb-4">
            Was ist Ihre Immobilie wert?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ermitteln Sie in nur 2 Minuten eine erste Werteinschätzung Ihrer Immobilie.
            Für eine präzise Bewertung kontaktieren Sie uns gerne persönlich.
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Eingabebereich */}
            <div className="space-y-8">
              {/* Objekttyp */}
              <div>
                <label className="block mb-3 text-white">Objekttyp</label>
                <select
                  value={objekttyp}
                  onChange={(e) => {
                    setObjekttyp(e.target.value);
                    setShowResult(false);
                  }}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A2694A] transition-colors"
                >
                  <option value="einfamilienhaus">Einfamilienhaus</option>
                  <option value="reihenhaus">Reihenhaus</option>
                  <option value="doppelhaushälfte">Doppelhaushälfte</option>
                  <option value="eigentumswohnung">Eigentumswohnung</option>
                  <option value="mehrfamilienhaus">Mehrfamilienhaus</option>
                </select>
              </div>

              {/* Wohnfläche */}
              <div>
                <label className="flex items-center justify-between mb-3">
                  <span className="text-white flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#808FA6]" />
                    Wohnfläche
                  </span>
                  <span className="text-[#A2694A]">{wohnflaeche} m²</span>
                </label>
                <Slider
                  value={[wohnflaeche]}
                  onValueChange={(value) => {
                    setWohnflaeche(value[0]);
                    setShowResult(false);
                  }}
                  min={30}
                  max={500}
                  step={5}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 m²</span>
                  <span>500 m²</span>
                </div>
              </div>

              {/* Zimmer */}
              <div>
                <label className="flex items-center justify-between mb-3">
                  <span className="text-white">Anzahl Zimmer</span>
                  <span className="text-[#A2694A]">{zimmer}</span>
                </label>
                <Slider
                  value={[zimmer]}
                  onValueChange={(value) => {
                    setZimmer(value[0]);
                    setShowResult(false);
                  }}
                  min={1}
                  max={10}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10+</span>
                </div>
              </div>

              {/* Baujahr */}
              <div>
                <label className="flex items-center justify-between mb-3">
                  <span className="text-white">Baujahr</span>
                  <span className="text-[#A2694A]">{baujahr}</span>
                </label>
                <Slider
                  value={[baujahr]}
                  onValueChange={(value) => {
                    setBaujahr(value[0]);
                    setShowResult(false);
                  }}
                  min={1900}
                  max={2025}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1900</span>
                  <span>2025</span>
                </div>
              </div>

              {/* Lage */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-white">
                  <MapPin className="w-5 h-5 text-[#808FA6]" />
                  Lage
                </label>
                <Input
                  value={adresse}
                  onChange={(e) => {
                    setAdresse(e.target.value);
                    setShowResult(false);
                  }}
                  placeholder="Adresse oder PLZ eingeben"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A2694A] transition-colors"
                />
              </div>

              {/* Zustand */}
              <div>
                <label className="block mb-3 text-white">Zustand</label>
                <select
                  value={zustand}
                  onChange={(e) => {
                    setZustand(e.target.value);
                    setShowResult(false);
                  }}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A2694A] transition-colors"
                >
                  <option value="neuwertig">Neuwertig</option>
                  <option value="gut">Gut gepflegt</option>
                  <option value="renovierungsbedarf">Renovierungsbedürftig</option>
                  <option value="sanierungsbedarf">Sanierungsbedürftig</option>
                </select>
              </div>
            </div>

            {/* Ergebnisbereich */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-[#808FA6]/10 to-[#A2694A]/10 border border-[#808FA6]/20 rounded-xl p-8 flex-1 flex flex-col justify-center">
                {!showResult ? (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-[#A2694A]/20 rounded-full flex items-center justify-center mx-auto">
                      <Calculator className="w-10 h-10 text-[#A2694A]" />
                    </div>
                    <p className="text-gray-400">
                      Passen Sie die Parameter an und klicken Sie auf "Wert berechnen"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-6 h-6 text-[#A2694A]" />
                        <span className="text-[#808FA6]">Geschätzter Wert</span>
                      </div>
                      <div className="text-white mb-2" style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 }}>
                        {formatCurrency(wert.mittel)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Spanne: {formatCurrency(wert.min)} - {formatCurrency(wert.max)}
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-3">
                        💡 <span className="text-white">Hinweis:</span> Dies ist eine automatische Schätzung.
                      </p>
                      <p className="text-sm text-gray-400">
                        Für eine <span className="text-[#A2694A]">präzise und kostenlose Bewertung</span> vor Ort
                        kontaktieren Sie uns gerne.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleBerechnen}
                className="w-full mt-6 bg-[#A2694A] hover:bg-[#8B5A3C] text-white py-6 transition-all duration-300 hover:scale-105"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {showResult ? "Neu berechnen" : "Wert berechnen"}
              </Button>

              {showResult && (
                <a href="#kontakt">
                  <Button
                    variant="outline"
                    className="w-full mt-3 border-[#808FA6] text-[#808FA6] hover:bg-[#808FA6] hover:text-white py-6 transition-all duration-300"
                  >
                    Kostenlose Bewertung anfragen
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Trust-Elemente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-[#0a0a0a]/50 border border-white/5 rounded-lg">
            <div className="text-[#A2694A] text-3xl mb-2">100%</div>
            <div className="text-gray-400 text-sm">Kostenlos & unverbindlich</div>
          </div>
          <div className="text-center p-6 bg-[#0a0a0a]/50 border border-white/5 rounded-lg">
            <div className="text-[#A2694A] text-3xl mb-2">180+</div>
            <div className="text-gray-400 text-sm">Bewertete Immobilien</div>
          </div>
          <div className="text-center p-6 bg-[#0a0a0a]/50 border border-white/5 rounded-lg">
            <div className="text-[#A2694A] text-3xl mb-2">13+</div>
            <div className="text-gray-400 text-sm">Jahre Markterfahrung</div>
          </div>
        </div>
      </div>
    </section>
  );
}