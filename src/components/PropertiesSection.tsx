import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PropertyCard } from "./PropertyCard";
import { ExposeRequestDialog } from "./ExposeRequestDialog";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
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

function usePageSize(): number {
  const getSize = () => {
    if (window.innerWidth >= 1024) return 6;
    if (window.innerWidth >= 768) return 4;
    return 3;
  };
  const [pageSize, setPageSize] = useState(getSize);
  useEffect(() => {
    const handler = () => setPageSize(getSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return pageSize;
}

interface NumberStepInputProps {
  value: string;
  onChange: (val: string) => void;
  step: number;
  placeholder?: string;
}

interface NumberStepInputProps {
  value: string;
  onChange: (val: string) => void;
  step: number;
  placeholder?: string;
  formatThousands?: boolean;
}

function NumberStepInput({ value, onChange, step, placeholder, formatThousands }: NumberStepInputProps) {
  const current = value === "" ? 0 : parseInt(value, 10);

  const decrement = () => {
    const next = Math.max(0, current - step);
    onChange(next === 0 && value === "" ? "" : String(next));
  };

  const increment = () => {
    const base = value === "" ? 0 : current;
    onChange(String(base + step));
  };

  const displayValue = formatThousands && value !== ""
    ? current.toLocaleString("de-DE")
    : value;

  return (
    <div className="flex h-10 bg-[#111111] border border-white/10 rounded-md overflow-hidden">
      <button
        type="button"
        onClick={decrement}
        className="w-10 shrink-0 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 border-r border-white/10 text-lg leading-none transition-colors"
        aria-label="Verringern"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-white text-sm text-center placeholder:text-gray-600 focus:outline-none px-1"
      />
      <button
        type="button"
        onClick={increment}
        className="w-10 shrink-0 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 border-l border-white/10 text-lg leading-none transition-colors"
        aria-label="Erhöhen"
      >
        +
      </button>
    </div>
  );
}

interface PaginatedGridProps {
  properties: Property[];
  showExposeButton?: boolean;
  onRequestExpose?: (id: string, title: string) => void;
  emptyText: string;
  resetKey: string;
}

function PaginatedGrid({ properties, showExposeButton, onRequestExpose, emptyText, resetKey }: PaginatedGridProps) {
  const pageSize = usePageSize();
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [resetKey, pageSize]);

  const totalPages = Math.ceil(properties.length / pageSize);
  const paginated = properties.slice((page - 1) * pageSize, page * pageSize);

  if (properties.length === 0) {
    return <p className="text-center text-gray-500 py-12">{emptyText}</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginated.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showExposeButton={showExposeButton}
            onRequestExpose={onRequestExpose}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-white/10 hover:bg-white/5 h-9 w-9 p-0"
            aria-label="Vorherige Seite"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              onClick={() => setPage(n)}
              className={`h-9 w-9 p-0 ${
                n === page
                  ? "bg-[#C2A878] hover:bg-[#C2A878]/90 text-[#111111] border-transparent"
                  : "border-white/10 hover:bg-white/5 text-gray-400"
              }`}
            >
              {n}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-white/10 hover:bg-white/5 h-9 w-9 p-0"
            aria-label="Nächste Seite"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
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
  const [filterResetKey, setFilterResetKey] = useState("");

  const handleRequestExpose = (propertyId: string, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setDialogOpen(true);
  };

  const handleApply = () => {
    setActiveFilter({ ...pendingFilter });
    setFilterResetKey(JSON.stringify(pendingFilter));
  };

  const handleReset = () => {
    setPendingFilter(EMPTY_FILTER);
    setActiveFilter(EMPTY_FILTER);
    setFilterResetKey("");
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
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex items-center gap-2 text-[#C2A878] mb-3">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Filter</span>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
              <div className="min-w-0">
                <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">Typ</label>
                <Select
                  value={pendingFilter.type}
                  onValueChange={(val) =>
                    setPendingFilter((f) => ({ ...f, type: val === "all" ? "" : val }))
                  }
                >
                  <SelectTrigger className="bg-[#111111] border-white/10 text-white h-10 w-full">
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

              <div className="min-w-0">
                <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">Max. Kaufpreis (€)</label>
                <NumberStepInput
                  value={pendingFilter.maxPrice}
                  onChange={(val) => setPendingFilter((f) => ({ ...f, maxPrice: val }))}
                  step={10000}
                  placeholder="z. B. 600.000"
                  formatThousands
                />
              </div>

              <div className="min-w-0">
                <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">Min. Fläche (m²)</label>
                <NumberStepInput
                  value={pendingFilter.minArea}
                  onChange={(val) => setPendingFilter((f) => ({ ...f, minArea: val }))}
                  step={10}
                  placeholder="z. B. 80"
                />
              </div>

              <div className="flex gap-2 md:col-span-3 md:pt-1 lg:col-span-1 lg:pt-0">
                <Button
                  onClick={handleApply}
                  className="flex-1 lg:flex-none lg:px-6 bg-[#C2A878] hover:bg-[#C2A878]/90 text-[#111111] h-10 text-sm font-medium transition-colors"
                >
                  Anwenden
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!filterOn}
                  className="flex-1 lg:flex-none lg:px-5 border-white/10 hover:bg-white/5 h-10 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Zurücksetzen
                </Button>
              </div>
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
              <PropertySkeleton count={6} />
            ) : (
              <PaginatedGrid
                properties={filteredActive}
                showExposeButton
                onRequestExpose={handleRequestExpose}
                emptyText={filterOn ? "Keine Immobilien entsprechen dem Filter." : "Aktuell keine Immobilien verfügbar."}
                resetKey={filterResetKey + "-current"}
              />
            )}
          </TabsContent>

          <TabsContent value="sold">
            {loading ? (
              <PropertySkeleton count={6} />
            ) : (
              <PaginatedGrid
                properties={filteredReferences}
                emptyText={filterOn ? "Keine Referenzen entsprechen dem Filter." : "Noch keine Referenzen vorhanden."}
                resetKey={filterResetKey + "-sold"}
              />
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
