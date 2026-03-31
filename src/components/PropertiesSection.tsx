import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PropertyCard } from "./PropertyCard";
import { ExposeRequestDialog } from "./ExposeRequestDialog";
import { useProperties } from "@/hooks/useProperties";

export function PropertiesSection() {
  const { active, references, loading, error } = useProperties();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleRequestExpose = (propertyId: string, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setDialogOpen(true);
  };

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

        <Tabs defaultValue="current">
          <TabsList className="flex justify-center">
            <TabsTrigger value="current">Aktuell</TabsTrigger>
            <TabsTrigger value="sold">Referenzen</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {loading ? (
              <PropertySkeleton count={3} />
            ) : active.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Aktuell keine Immobilien verfügbar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {active.map((property) => (
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
            ) : references.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Noch keine Referenzen vorhanden.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {references.map((property) => (
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
