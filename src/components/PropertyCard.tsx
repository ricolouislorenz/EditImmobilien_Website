import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Maximize, FileText } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useState } from "react";

interface PropertyCardProps {
  id?: number;
  image: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number | string;
  type: string;
  showExposeButton?: boolean;
  onRequestExpose?: (propertyId: number, propertyTitle: string) => void;
}

export function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  type,
  showExposeButton = false,
  onRequestExpose,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl hover:shadow-[#808FA6]/20 transition-all bg-[#121212] border-white/10 hover:border-[#808FA6]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-[#A2694A] hover:bg-[#A2694A]">{type}</Badge>

        {showExposeButton && isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all">
            <Button
              onClick={() => id && onRequestExpose?.(id, title)}
              className="bg-[#808FA6] hover:bg-[#808FA6]/90 gap-2"
            >
              <FileText className="w-4 h-4" />
              Exposé anfordern
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="mb-2 text-white">{title}</h3>
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-4 mb-4 text-gray-400">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{area} m²</span>
          </div>
        </div>
        <div className="text-[#808FA6] font-medium">
          {price}
        </div>
      </CardContent>
    </Card>
  );
}