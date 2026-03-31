import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase, fetchAllProperties } from "@/lib/supabase";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  sold: "Verkauft",
  rented: "Vermietet",
  sold_and_rented: "Verk. & Verm.",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-600",
  sold: "bg-red-600",
  rented: "bg-orange-500",
  sold_and_rented: "bg-purple-600",
};

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(property: Property) {
    if (!confirm(`"${property.title}" wirklich löschen?`)) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      alert("Fehler beim Löschen: " + error.message);
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Immobilien</h2>
        <Button asChild size="sm">
          <Link to="/admin/properties/new">
            <Plus className="w-4 h-4 mr-2" />
            Neue Immobilie
          </Link>
        </Button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Laden...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">Noch keine Immobilien vorhanden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-left">
                <th className="pb-3 pr-4 font-medium">Titel</th>
                <th className="pb-3 pr-4 font-medium">Ort</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Preis</th>
                <th className="pb-3 font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 pr-4 text-white">{p.title}</td>
                  <td className="py-3 pr-4 text-gray-400">{p.location}</td>
                  <td className="py-3 pr-4">
                    <Badge className={`${STATUS_COLORS[p.status] ?? "bg-gray-600"} text-white border-0`}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{p.price}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <Link to={`/admin/properties/${p.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
