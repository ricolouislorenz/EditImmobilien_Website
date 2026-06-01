import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PropertyCard } from "./PropertyCard";
import { ExposeRequestDialog } from "./ExposeRequestDialog";
import { PropertyDetailDialog } from "./PropertyDetailDialog";
import { Reveal } from "./Reveal";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SlidersHorizontal } from "lucide-react";
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

const PAGE_SIZE = 4;

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

function sortNewestFirst(properties: Property[]): Property[] {
  return [...properties].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function isFilterActive(filter: FilterState): boolean {
  return !!(filter.type || filter.maxPrice || filter.minArea);
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
        className="flex-1 min-w-0 bg-transparent text-white text-sm text-center placeholder:text-gray-500 focus:outline-none px-1"
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
  onSelect?: (property: Property) => void;
  emptyText: string;
  resetKey: string;
}

function getVisiblePages(page: number, totalPages: number): Array<number | string> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const validPages = Array.from(pages)
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const visiblePages: Array<number | string> = [];

  validPages.forEach((pageNumber, index) => {
    const previousPage = validPages[index - 1];
    if (previousPage && pageNumber - previousPage > 1) {
      visiblePages.push(pageNumber - previousPage === 2 ? previousPage + 1 : `ellipsis-${index}`);
    }
    visiblePages.push(pageNumber);
  });

  return visiblePages;
}

function PaginatedGrid({
  properties,
  showExposeButton,
  onRequestExpose,
  onSelect,
  emptyText,
  resetKey,
}: PaginatedGridProps) {
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const paginated = properties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const firstVisibleItem = properties.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisibleItem = Math.min(page * PAGE_SIZE, properties.length);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div>
      <div className="mb-6 flex items-center border-y border-white/10 py-3 text-sm text-gray-400">
        {properties.length === 0
          ? "Keine Immobilien"
          : `Zeige ${firstVisibleItem} bis ${lastVisibleItem} von ${properties.length} ${
              properties.length === 1 ? "Immobilie" : "Immobilien"
            }`}
      </div>

      {properties.length === 0 ? (
        <p className="text-center text-gray-400 py-12">{emptyText}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {paginated.map((property, idx) => (
              <Reveal key={property.id} delayMs={idx * 70} className="h-full">
                <PropertyCard
                  property={property}
                  showExposeButton={showExposeButton}
                  onRequestExpose={onRequestExpose}
                  onSelect={onSelect}
                />
              </Reveal>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm"
              aria-label="Immobilien Seiten"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-gray-400 transition-colors hover:text-[#C2A878] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-gray-400"
              >
                « zurück
              </button>

              {visiblePages.map((item) =>
                typeof item === "number" ? (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={
                      item === page
                        ? "min-w-8 rounded bg-[#C2A878] px-2.5 py-1 font-medium text-[#111111]"
                        : "min-w-8 rounded px-2.5 py-1 text-gray-400 transition-colors hover:text-[#C2A878]"
                    }
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="px-1 text-gray-500">
                    …
                  </span>
                )
              )}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-gray-400 transition-colors hover:text-[#C2A878] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-gray-400"
              >
                nächste »
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function PropertyTabLabel({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center gap-2">
      <span>{label}</span>
      <span className="min-w-6 rounded-full bg-white/10 px-2 py-0.5 text-xs text-inherit">
        {count}
      </span>
    </span>
  );
}

export function PropertiesSection() {
  const { active, references, loading, error } = useProperties();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [pendingFilter, setPendingFilter] = useState<FilterState>(EMPTY_FILTER);
  const [activeFilter, setActiveFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterResetKey, setFilterResetKey] = useState("");

  const handleRequestExpose = (propertyId: string, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setDialogOpen(true);
  };

  const handleSelectProperty = (property: Property) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  const handleDetailRequestExpose = (propertyId: string, propertyTitle: string) => {
    setDetailOpen(false);
    handleRequestExpose(propertyId, propertyTitle);
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

  const filteredActive = useMemo(
    () => sortNewestFirst(applyFilter(active, activeFilter)),
    [active, activeFilter]
  );
  const filteredReferences = useMemo(
    () => sortNewestFirst(applyFilter(references, activeFilter)),
    [references, activeFilter]
  );
  const filterOn = isFilterActive(activeFilter);

  return (
    <section id="immobilien" className="py-20 bg-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">
            Immobilien in Hamburg, Wedel, Holm & Umgebung
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto">
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

        <div className="mx-auto max-w-7xl">
        <Tabs defaultValue="current">
          <div className="mb-8 flex justify-center">
            <TabsList className="mb-0 grid h-auto w-full max-w-md grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#1a1a1a] p-1 sm:w-fit">
              <TabsTrigger
                value="current"
                className="h-11 px-4 data-[state=active]:shadow-none sm:px-6"
              >
                <PropertyTabLabel label="Aktuell" count={filteredActive.length} />
              </TabsTrigger>
              <TabsTrigger
                value="sold"
                className="h-11 px-4 data-[state=active]:shadow-none sm:px-6"
              >
                <PropertyTabLabel label="Referenzen" count={filteredReferences.length} />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current">
            {loading ? (
              <PropertySkeleton count={PAGE_SIZE} />
            ) : (
              <PaginatedGrid
                properties={filteredActive}
                showExposeButton
                onRequestExpose={handleRequestExpose}
                onSelect={handleSelectProperty}
                emptyText={filterOn ? "Keine Immobilien entsprechen dem Filter." : "Aktuell keine Immobilien verfügbar."}
                resetKey={filterResetKey + "-current"}
              />
            )}
          </TabsContent>

          <TabsContent value="sold">
            {loading ? (
              <PropertySkeleton count={PAGE_SIZE} />
            ) : (
              <PaginatedGrid
                properties={filteredReferences}
                onSelect={handleSelectProperty}
                emptyText={filterOn ? "Keine Referenzen entsprechen dem Filter." : "Noch keine Referenzen vorhanden."}
                resetKey={filterResetKey + "-sold"}
              />
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {selectedProperty && (
        <ExposeRequestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          propertyTitle={selectedProperty.title}
          propertyId={selectedProperty.id}
        />
      )}

      <PropertyDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        property={detailProperty}
        onRequestExpose={handleDetailRequestExpose}
      />
    </section>
  );
}

function PropertySkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-white/5" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
            <div className="h-9 bg-white/5 rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
