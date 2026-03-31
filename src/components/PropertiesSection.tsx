import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PropertyCard } from "./PropertyCard";
import { ExposeRequestDialog } from "./ExposeRequestDialog";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import type { Property } from "@/types";

const PROPERTY_TYPES = [
  "Einfamilienhaus",
  "Doppelhaushälfte",
  "Reihenhaus",
  "Eigentumswohnung",
  "Mehrfamilienhaus",
  "Penthouse",
  "Ladenfläche",
  "Sonstiges",
];

interface FilterState {
  type: string;
  maxPrice: string;
  minArea: string;
}

const EMPTY_FILTER: FilterState = { type: "", maxPrice: "", minArea: "" };

function parsePrice(price: string): number {
  const cleaned = price.replace(/[€\s]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? Infinity : num;
}

function applyFilter(properties: Property[], filter: FilterState): Property[] {
  return properties.filter((p) => {
    if (filter.type && p.type !== filter.type) return false;
    if (filter.maxPrice) {
      const price = parsePrice(p.price);
      if (price > parseFloat(filter.maxPrice)) return false;
    }
    if (filter.minArea) {
      const area = p.area ?? 0;
      if (area < parseFloat(filter.minArea)) return false;
    }
    return true;
  });
}

function isFilterActive(filter: FilterState): boolean {
  return !!(filter.type || filter.maxPrice || filter.minArea);
}

export function PropertiesSection() {
  const { active, references, loading, error } = useProperties();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [pendingFilter, setPendingFilter] = useState<FilterState>(EMPTY_FILTER);
  const [activeFilter, setActiveFilter] = useState<FilterState>(EMPTY_FILTER);

  const handleRequestExpose = (propertyId: string, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setDialogOpen(true);
  };

  const handleApply = () => setActiveFilter({ ...pendingFilter });

  const handleReset = () => {
    setPendingFilter(EMPTY_FILTER);
    setActiveFilter(EMPTY_FILTER);
  };

  const filteredActive = applyFilter(active, activeFilter);
  const filteredReferences = applyFilter(references, activeFilter);
  const filterOn = isFilterActive(activeFilter);

  return (
    <section id="immobilien" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">
            Immobilien in Hamburg, Wedel, Holm & Umgebung
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Entdecken Sie unser aktuelles Angebot und erfolgreich vermittelte
            Referenzobjekte. Vom Einfamilienhaus über Eigentumswohnungen bis zu
            Mehrfamilienhäusern in Hamburg, Norderstedt, Wedel und der gesamten
            Metropolregion.
          </p>
        </div>

        {error && (
          <p className="text-center text-red-400 mb-8 text-sm">{error}</p>
        )}

        {/* Filterleiste */}
        <div className="max-w-4xl mx-auto mb-8 bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex items-center gap-2 text-[#C2A878] shrink-0 self-center sm:self-end pb-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </div>

            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-400 mb-1 block">Typ</label>
              <Select
                value={pendingFilter.type}
                onValueChange={(val) =>
                  setPendingFilter((f) => ({ ...f, type: val === "all" ? "" : val }))
                }
              >
                <SelectTrigger className="bg-[#111111] border-white/10 text-white h-10">
                  <SelectValue placeholder="Alle Typen" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="all">Alle Typen</SelectItem>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-400 mb-1 block">Max. Kaufpreis (€)</label>
              <Input
                type="number"
                placeholder="z. B. 600000"
                value={pendingFilter.maxPrice}
                onChange={(e) =>
                  setPendingFilter((f) => ({ ...f, maxPrice: e.target.value }))
                }
                className="bg-[#111111] border-white/10 text-white placeholder:text-gray-600 h-10"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-400 mb-1 block">Min. Fläche (m²)</label>
              <Input
                type="number"
                placeholder="z. B. 80"
                value={pendingFilter.minArea}
                onChange={(e) =>
                  setPendingFilter((f) => ({ ...f, minArea: e.target.value }))
                }
                className="bg-[#111111] border-white/10 text-white placeholder:text-gray-600 h-10"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                onClick={handleApply}
                className="bg-[#C2A878] hover:bg-[#C2A878]/90 h-10"
              >
                Anwenden
              </Button>
              {filterOn && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-white/10 hover:bg-white/5 h-10 gap-1"
                >
                  <X className="w-4 h-4" />
                  Zurücksetzen
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="current">
          <TabsList className="flex justify-center">
            <TabsTrigger value="current">Aktuell</TabsTrigger>
            <TabsTrigger value="sold">Referenzen</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {loading ? (
              <PropertySkeleton count={3} />
            ) : filteredActive.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                {filterOn ? "Keine Immobilien entsprechen dem Filter." : "Aktuell keine Immobilien verfügbar."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActive.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showExposeButton
                    onRequestExpose={handleRequestExpose}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {loading ? (
              <PropertySkeleton count={6} />
            ) : filteredReferences.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                {filterOn ? "Keine Referenzen entsprechen dem Filter." : "Noch keine Referenzen vorhanden."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReferences.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedProperty && (
        <ExposeRequestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          propertyTitle={selectedProperty.title}
          propertyId={selectedProperty.id}
        />
      )}
    </section>
  );
}

function PropertySkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-white/5" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
