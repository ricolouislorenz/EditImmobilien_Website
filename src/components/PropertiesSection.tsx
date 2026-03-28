import { PropertyCard } from "./PropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ExposeRequestDialog } from "./ExposeRequestDialog";
import { useState } from "react";

const currentProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzE2NDczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Einfamilienhaus mit Garten",
    location: "25488 Holm",
    price: "€ 595.000",
    bedrooms: 6,
    bathrooms: 2,
    area: 182,
    type: "Kauf",
  },
];

const soldProperties = [
  {
    id: 101,
    image: "https://placehold.co/800x600?text=Doppelhaushaelfte",
    title: "Doppelhaushälfte",
    location: "22880 Wedel",
    price: "€ 699.000",
    bedrooms: 6,
    bathrooms: 2,
    area: 132.5,
    type: "Verkauft",
  },
  {
    id: 102,
    image: "https://placehold.co/800x600?text=Einfamilienhaus",
    title: "Einfamilienhaus am See",
    location: "21680 Stade",
    price: "€ 660.000",
    bedrooms: 5,
    bathrooms: 2,
    area: 140.27,
    type: "Verkauft",
  },
  {
    id: 103,
    image: "https://images.unsplash.com/photo-1614569863448-530317e56770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MzIyODA2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Einfamilienhaus",
    location: "93142 Maxhütte-Haidhof",
    price: "€ 349.000",
    bedrooms: 8,
    bathrooms: 2,
    area: 160,
    type: "Verkauft",
  },
  {
    id: 104,
    image: "https://images.unsplash.com/photo-1563273026-d342cef8f723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc2MzEyMDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mehrfamilienhaus",
    location: "63065 Offenbach",
    price: "VERKAUFT",
    bedrooms: "X",
    bathrooms: "X",
    area: "923 Wohnfläche + 385 Gewerbe",
    type: "Verkauft",
  },
  {
    id: 105,
    image: "https://images.unsplash.com/photo-1762285334577-b451d4b8e245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc3RvcmVmcm9udCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MzIyNzI0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Ladenfläche",
    location: "20259 Hamburg",
    price: "VERMIETET",
    bedrooms: "X",
    bathrooms: "X",
    area: 139,
    type: "Vermietet",
  },
  {
    id: 106,
    image: "https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjMxMzk5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Penthouse",
    location: "22397 Hamburg",
    price: "VERKAUFT",
    bedrooms: 4,
    bathrooms: 2,
    area: 137,
    type: "Verkauft",
  },
  {
    id: 107,
    image: "https://images.unsplash.com/photo-1583430312373-0fb9d4e0c4ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1pJTIwZGV0YWNoZWQlMjBob3VzZXxlbnwxfHx8fDE3NjMyMjgwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Doppelhaushälfte",
    location: "25358 Horst",
    price: "VERKAUFT",
    bedrooms: 4,
    bathrooms: 1,
    area: 126,
    type: "Verkauft",
  },
  {
    id: 108,
    image: "https://images.unsplash.com/photo-1710534190810-44698a394864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBnYXJkZW4lMjBmbG93ZXJzfGVufDF8fHx8MTc2MzIyODA2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mittelreihenhaus",
    location: "25469 Halstenbek",
    price: "VERKAUFT",
    bedrooms: 5,
    bathrooms: 2,
    area: 120,
    type: "Verkauft",
  },
  {
    id: 109,
    image: "https://placehold.co/800x600?text=Wohnung",
    title: "Wohnung",
    location: "22031 Hamburg",
    price: "VERMIETET",
    bedrooms: 3,
    bathrooms: 1,
    area: 75,
    type: "Vermietet",
  },
  {
    id: 110,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwaG91c2V8ZW58MXx8fHwxNzYzMjI4MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Eigentumswohnung am See",
    location: "22397 Hamburg",
    price: "VERKAUFT",
    bedrooms: 3,
    bathrooms: 1,
    area: 85,
    type: "Verkauft",
  },
  {
    id: 111,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjMyMjgwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Eigentumswohnung",
    location: "22850 Norderstedt",
    price: "VERKAUFT & VERMIETET",
    bedrooms: 1.5,
    bathrooms: 1,
    area: 48,
    type: "Verkauft & Vermietet",
  },
  {
    id: 112,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjMyMjgwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Eigentumswohnung",
    location: "22844 Norderstedt",
    price: "VERMIETET",
    bedrooms: 3,
    bathrooms: 1,
    area: 90,
    type: "Vermietet",
  },
  {
    id: 113,
    image: "https://images.unsplash.com/photo-1502672260066-6bc05c107096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjaW91cyUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjMyMjgwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Eigentumswohnung",
    location: "22844 Norderstedt",
    price: "VERMIETET",
    bedrooms: 4,
    bathrooms: 1,
    area: 110,
    type: "Vermietet",
  },
  {
    id: 114,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzIyODA2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Einfamilienhaus",
    location: "22145 Hamburg",
    price: "VERKAUFT",
    bedrooms: 6,
    bathrooms: 2,
    area: 185,
    type: "Verkauft",
  },
  {
    id: 115,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aWZhbWlseSUyMGhvdXNlfGVufDF8fHx8MTc2MzIyODA2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mehrfamilienhaus",
    location: "25451 Quickborn",
    price: "VERKAUFT",
    bedrooms: 6,
    bathrooms: 3,
    area: 255,
    type: "Verkauft",
  },
];

export function PropertiesSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleRequestExpose = (propertyId: number, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setDialogOpen(true);
  };

  return (
    <section id="immobilien" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-white">Immobilien in Hamburg, Wedel, Holm & Umgebung</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Entdecken Sie unser aktuelles Angebot und erfolgreich vermittelte Referenzobjekte. Vom Einfamilienhaus über Eigentumswohnungen bis zu Mehrfamilienhäusern in Hamburg, Norderstedt, Wedel und der gesamten Metropolregion.
          </p>
        </div>

        <Tabs defaultValue="current">
          <TabsList className="flex justify-center">
            <TabsTrigger value="current">Aktuell</TabsTrigger>
            <TabsTrigger value="sold">Referenzen</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  {...property}
                  showExposeButton={true}
                  onRequestExpose={handleRequestExpose}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sold">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {soldProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
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