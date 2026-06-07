import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { MapPin, Bed, Bath, Maximize, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/supabase";
import { PROPERTY_PLACEHOLDER } from "@/lib/assets";
import type { Property } from "@/types";

interface PropertyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onRequestExpose?: (propertyId: string, propertyTitle: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  sold: "Verkauft",
  rented: "Vermietet",
  sold_and_rented: "Verk. & Verm.",
};

function resolveImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return getImageUrl(path);
}

export function PropertyDetailDialog({
  open,
  onOpenChange,
  property,
  onRequestExpose,
}: PropertyDetailDialogProps) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!property) return null;

  const images = property.images.length > 0 ? property.images : [""];
  const safeIndex = Math.min(imageIndex, images.length - 1);
  const imageUrl = resolveImageUrl(images[safeIndex] ?? "") || PROPERTY_PLACEHOLDER;
  const areaDisplay = property.area_label ?? (property.area != null ? `${property.area} m²` : null);
  const showStatusBadge = property.status !== "active";
  const cleanLocation = property.location.replace(/(,?\s*Hamburg\s*,?\s*)/gi, "").trim();
  const canExpose = property.status === "active" && onRequestExpose;

  const handlePrev = () => setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setImageIndex(0);
        onOpenChange(next);
      }}
    >
      <DialogContent className="grid max-h-[90vh] w-full max-w-3xl gap-0 overflow-hidden border-white/10 bg-[#111111] p-0 text-white md:max-w-4xl">
        <DialogTitle className="sr-only">{property.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Details zur Immobilie {property.title} in {property.location}
        </DialogDescription>

        <div className="flex max-h-[90vh] min-h-0 flex-col">
          {/* Bildbereich – feste Höhe statt Aspect-Ratio, damit das Pop-up auch ohne Scrollen komplett sichtbar bleibt */}
          <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-black sm:h-[220px] md:h-[280px]">
            <ImageWithFallback
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            {showStatusBadge && (
              <Badge className="absolute left-3 top-3 bg-[#6B4F3A] text-xs hover:bg-[#6B4F3A] sm:left-4 sm:top-4 sm:text-sm">
                {STATUS_LABELS[property.status] ?? property.status}
              </Badge>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Vorheriges Bild"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 sm:left-3 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Nächstes Bild"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 sm:right-3 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                  {safeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Scrollbarer Inhalt (Scroll bleibt als Fallback bei sehr kleinen Viewports) */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 sm:gap-5 sm:p-6">
            <div className="min-w-0">
              <h2 className="mb-2 line-clamp-2 break-words text-lg font-semibold leading-snug text-white sm:text-xl md:text-2xl">
                {property.title}
              </h2>
              <div className="flex items-start gap-2 text-sm text-gray-300 sm:text-base">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C2A878] sm:h-5 sm:w-5" />
                <span className="break-words">{cleanLocation}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-3 sm:p-4 md:grid-cols-4 md:gap-4">
              {areaDisplay && (
                <DetailStat
                  icon={<Maximize className="h-4 w-4 text-[#C2A878] sm:h-5 sm:w-5" />}
                  label="Fläche"
                  value={areaDisplay}
                />
              )}
              {property.bedrooms != null && (
                <DetailStat
                  icon={<Bed className="h-4 w-4 text-[#C2A878] sm:h-5 sm:w-5" />}
                  label="Schlafzimmer"
                  value={String(property.bedrooms)}
                />
              )}
              {property.bathrooms != null && (
                <DetailStat
                  icon={<Bath className="h-4 w-4 text-[#C2A878] sm:h-5 sm:w-5" />}
                  label="Bäder"
                  value={String(property.bathrooms)}
                />
              )}
              <DetailStat
                icon={<span className="text-sm text-[#C2A878] sm:text-base">⌂</span>}
                label="Typ"
                value={property.type}
              />
            </div>

            {/* Preis */}
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 pt-3 sm:pt-4">
              <span className="text-xs uppercase tracking-[0.18em] text-gray-400">Preis</span>
              <span className="break-words text-xl font-semibold text-[#C2A878] sm:text-2xl">
                {property.price}
              </span>
            </div>

            {/* CTA */}
            {canExpose && (
              <Button
                onClick={() => onRequestExpose?.(property.reference, property.title)}
                className="h-11 w-full gap-2 bg-[#C2A878] text-sm font-medium text-[#111111] hover:bg-[#C2A878]/90 sm:text-base"
              >
                <FileText className="h-5 w-5" />
                Exposé anfordern
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex min-w-0 items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <span className="break-words text-sm font-medium text-white sm:text-base">{value}</span>
    </div>
  );
}
