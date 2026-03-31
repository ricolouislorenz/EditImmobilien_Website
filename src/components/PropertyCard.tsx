import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Maximize, FileText } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useState } from "react";
import { getImageUrl } from "@/lib/supabase";
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
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = resolveImageUrl(property.images[0] ?? "");
  const areaDisplay = property.area_label ?? (property.area != null ? `${property.area} m²` : null);

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl hover:shadow-[#C2A878]/20 transition-all bg-[#111111] border-white/10 hover:border-[#C2A878]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64">
        <ImageWithFallback
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-[#6B4F3A] hover:bg-[#6B4F3A]">
          {STATUS_LABELS[property.status] ?? property.status}
        </Badge>

        {showExposeButton && isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all">
            <Button
              onClick={() => onRequestExpose?.(property.id, property.title)}
              className="bg-[#C2A878] hover:bg-[#C2A878]/90 gap-2"
            >
              <FileText className="w-4 h-4" />
              Exposé anfordern
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="mb-2 text-white">{property.title}</h3>
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-gray-400">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {areaDisplay && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{areaDisplay}</span>
            </div>
          )}
        </div>

        <div className="text-[#C2A878] font-medium">{property.price}</div>
      </CardContent>
    </Card>
  );
}
