import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import { confirmPropertyAction, type TrashedProperty } from "@/lib/property-trash";
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

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={`${STATUS_COLORS[status] ?? "bg-gray-600"} border-0 text-white`}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function PropertiesPage() {
  const location = useLocation();
  const imageCleanupFailed = location.state?.imageCleanupFailed === true;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trash, setTrash] = useState<TrashedProperty[]>([]);
  const [trashOpen, setTrashOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const actionInFlight = useRef(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [data, archived] = await Promise.all([
        fetchAllProperties(),
        supabase.from("property_trash").select("property_id, snapshot, deleted_at, expires_at").order("deleted_at", { ascending: false }),
      ]);
      if (archived.error) throw new Error("Der Papierkorb konnte nicht geladen werden. Bitte Anmeldung und Datenbankeinrichtung prüfen.");
      setProperties(data);
      setTrash(archived.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Anzeige analog zur Website: nach manueller Reihenfolge.
  const sortedProperties = [...properties].sort((a, b) => a.sort_order - b.sort_order);

  async function handleDelete(property: Property) {
    if (actionInFlight.current || !confirm(`„${property.title}“ in den Papierkorb verschieben?\nDer Eintrag verschwindet von der Website und kann 30 Tage lang wiederhergestellt werden.`)) return;
    actionInFlight.current = true;
    setBusy(property.id); setError(null); setNotice(null);
    try {
      await confirmPropertyAction(() => supabase.rpc("delete_property", {
        p_id: property.id, p_expected_updated_at: property.updated_at,
      }), property.id);
      setNotice("Die Immobilie wurde in den Papierkorb verschoben. Sie kann 30 Tage lang wiederhergestellt werden.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschung nicht bestätigt. Bitte neu laden und prüfen.");
    } finally { actionInFlight.current = false; setBusy(null); }
  }

  async function handleRestore(property: TrashedProperty) {
    if (actionInFlight.current || !confirm(`„${property.snapshot.title ?? "Immobilie"}“ wiederherstellen?\nSie wird wieder auf der Website angezeigt und am Ende ihres Bereichs eingeordnet.`)) return;
    actionInFlight.current = true;
    setBusy(property.property_id); setError(null); setNotice(null);
    try {
      await confirmPropertyAction(() => supabase.rpc("restore_property", { p_id: property.property_id }), property.property_id);
      setNotice("Die Immobilie wurde wiederhergestellt und am Ende ihres Bereichs eingeordnet.");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Wiederherstellung nicht bestätigt."); }
    finally { actionInFlight.current = false; setBusy(null); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Immobilien</h2>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-500">
              {properties.length} {properties.length === 1 ? "Eintrag" : "Einträge"}
            </p>
          )}
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link to="/admin/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Neue Immobilie</span>
            <span className="sm:hidden">Neu</span>
          </Link>
        </Button>
      </div>

      {imageCleanupFailed && (
        <p role="status" className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Die Immobilie wurde gespeichert. Entfernte Bilder konnten jedoch nicht vollständig aus dem
          Bildspeicher gelöscht werden und sind möglicherweise noch über ihre bisherigen Links abrufbar.
          Bitte die technische Betreuung um Bereinigung bitten. Erneutes Speichern ist nicht nötig.
        </p>
      )}
      {notice && <p role="status" className="mb-4 text-sm text-green-300">{notice}</p>}
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error} <button type="button" disabled={Boolean(busy)} onClick={load} className="underline">Neu laden</button></p>}

      {loading ? (
        <p className="text-gray-500">Laden...</p>
      ) : properties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 px-6 py-12 text-center">
          <p className="text-gray-400">Noch keine Immobilien vorhanden.</p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/admin/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Erste Immobilie anlegen
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Handy & Tablet: Karten */}
          <ul className="space-y-3 lg:hidden">
            {sortedProperties.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-[#C2A878]">{p.reference}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <h3 className="mt-1.5 truncate font-medium text-white">{p.title}</h3>
                    <p className="truncate text-sm text-gray-400">{p.location}</p>
                    <p className="mt-1 text-sm font-medium text-[#C2A878]">{p.price}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 text-gray-200 hover:text-white"
                  >
                    <Link to={`/admin/properties/${p.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(p)}
                    disabled={Boolean(busy)}
                    aria-label={`${p.title} löschen`}
                    className="border-white/10 text-gray-400 hover:border-red-500/40 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: Tabelle */}
          <div className="hidden overflow-hidden rounded-xl border border-white/10 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-gray-400">
                  <th className="px-4 py-3 font-medium">Immobilien-ID</th>
                  <th className="px-4 py-3 font-medium">Titel</th>
                  <th className="px-4 py-3 font-medium">Ort</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Preis</th>
                  <th className="px-4 py-3 text-right font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#C2A878]">{p.reference}</td>
                    <td className="px-4 py-3 text-white">{p.title}</td>
                    <td className="px-4 py-3 text-gray-400">{p.location}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Link to={`/admin/properties/${p.id}`} aria-label={`${p.title} bearbeiten`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                          onClick={() => handleDelete(p)}
                          disabled={Boolean(busy)}
                          aria-label={`${p.title} löschen`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!loading && <section className="mt-8 rounded-xl border border-white/10 bg-[#1a1a1a] p-4 sm:p-5">
        <button type="button" onClick={() => setTrashOpen((open) => !open)} aria-expanded={trashOpen}
          aria-controls="property-trash" className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-medium text-gray-200">
          <span className="flex items-center gap-2"><Trash2 className="h-4 w-4" />Papierkorb ({trash.length})</span>
          <span className="text-xs text-[#C2A878]">{trashOpen ? "Schließen" : "Öffnen"}</span>
        </button>
        {trashOpen && <div id="property-trash" className="mt-3 space-y-3">
          <p className="text-xs text-gray-400">30 Tage wiederherstellbar. Danach werden die Einträge beim nächsten aktiven Bereinigungslauf endgültig entfernt. Bilder bleiben während der Frist erhalten.</p>
          {trash.length === 0 ? <p className="text-sm text-gray-400">Der Papierkorb ist leer.</p> : <ul className="divide-y divide-white/10">
            {trash.map((p) => {
              const expired = new Date(p.expires_at).getTime() <= Date.now();
              return <li key={p.property_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0"><p className="break-words text-sm text-white">{p.snapshot.reference} · {p.snapshot.title ?? "Immobilie"}</p>
                  <p className="mt-1 text-xs text-gray-400">{expired ? "Wiederherstellungsfrist abgelaufen" : `Wiederherstellbar bis ${new Date(p.expires_at).toLocaleString("de-DE")}`}</p>
                </div>
                <Button type="button" variant="outline" size="sm" disabled={Boolean(busy) || expired} onClick={() => handleRestore(p)} className="border-white/10 text-gray-200">
                  <RotateCcw className="mr-2 h-4 w-4" />Wiederherstellen
                </Button>
              </li>;
            })}
          </ul>}
        </div>}
      </section>}
    </div>
  );
}
