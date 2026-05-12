import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Maximize, FileText } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button } from "./ui/button";
import { getImageUrl } from "@/lib/supabase";
import { PROPERTY_PLACEHOLDER } from "@/lib/assets";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  showExposeButton?: boolean;
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

export function PropertyCard({
  property,
  showExposeButton = false,
  onRequestExpose,
}: PropertyCardProps) {
  const imageUrl = resolveImageUrl(property.images[0] ?? "") || PROPERTY_PLACEHOLDER;
  const areaDisplay = property.area_label ?? (property.area != null ? `${property.area} m²` : null);
  const showStatusBadge = property.status !== "active";
  const cleanLocation = property.location.replace(/(,?\s*Hamburg\s*,?\s*)/gi, "").trim();

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-[#111111] transition-all hover:border-[#C2A878] hover:shadow-2xl hover:shadow-[#C2A878]/20">
      <div className="relative aspect-[3/2] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {showStatusBadge && (
          <Badge className="absolute left-2.5 top-2.5 bg-[#6B4F3A] text-xs hover:bg-[#6B4F3A]">
            {STATUS_LABELS[property.status] ?? property.status}
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 line-clamp-2 text-sm font-medium text-white sm:text-base">
          {property.title}
        </h3>

        <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C2A878]" />
          <span className="truncate">{cleanLocation}</span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          {areaDisplay && (
            <div className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5 text-[#C2A878]" />
              <span>{areaDisplay}</span>
            </div>
          )}
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-[#C2A878]" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-[#C2A878]" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-3 text-base font-medium text-[#C2A878]">
            {property.price}
          </div>

          {showExposeButton && (
            <Button
              onClick={() => onRequestExpose?.(property.id, property.title)}
              className="h-9 w-full gap-1.5 bg-[#C2A878] text-xs text-[#111111] hover:bg-[#C2A878]/90 sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              Exposé anfordern
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
