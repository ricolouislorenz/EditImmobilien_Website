import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { positionSiblings, visiblePosition, sortOrderForPosition, type PositionProperty } from "@/lib/property-position";
import { PROPERTIES_PAGE_SIZE } from "@/lib/pagination";

export function PropertyPositionPicker({ properties, status, title, sortOrder, onChange, disabled, loading, error, onRetry }: {
  properties: PositionProperty[];
  status: string;
  title: string;
  sortOrder: number;
  onChange: (value: number) => void;
  disabled: boolean;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  const siblings = positionSiblings(properties, status);
  const rank = visiblePosition(siblings, sortOrder);
  const total = siblings.length + 1;
  const page = Math.floor((rank - 1) / PROPERTIES_PAGE_SIZE) + 1;
  const slot = ((rank - 1) % PROPERTIES_PAGE_SIZE) + 1;
  const tab = status === "active" ? "Aktuell" : "Referenzen";
  const blocked = disabled || loading || error;
  const preview = [...siblings];
  preview.splice(rank - 1, 0, { id: "current", title: title.trim() || "Diese Immobilie", status, sort_order: sortOrder });
  const start = Math.max(0, Math.min(rank - 3, preview.length - 5));
  function choose(position: number) {
    if (!blocked && position !== rank) onChange(sortOrderForPosition(siblings, position));
  }

  return (
    <div className="space-y-4">
      {loading ? <p role="status" className="text-sm text-gray-400">Reihenfolge wird geladen …</p>
        : error ? <div role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Die Reihenfolge konnte nicht geladen werden. Die bisherige Einstellung bleibt erhalten.
          <button type="button" onClick={onRetry} disabled={disabled} className="ml-2 underline disabled:opacity-40">Erneut laden</button>
        </div> : <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#C2A878]/30 bg-[#C2A878]/10 p-4" aria-live="polite" aria-atomic="true">
            <div>
              <p className="text-xs text-[#C2A878]">Website · {tab}</p>
              <p className="mt-1 text-lg font-semibold text-white">Platz {rank} von {total}</p>
              <p className="text-sm text-gray-300">Seite {page} · Platz {slot} auf dieser Seite</p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-gray-300">Vorschau</span>
          </div>

          <div>
            <label htmlFor="property-position" className="text-sm text-gray-300">Wo soll die Immobilie erscheinen?</label>
            <select id="property-position" value={rank} disabled={blocked} onChange={(e) => choose(Number(e.target.value))}
              aria-describedby="property-position-hint"
              className="mt-2 w-full rounded-md border border-white/15 bg-[#111111] px-3 py-3 text-sm text-white disabled:opacity-40">
              {Array.from({ length: total }, (_, i) => {
                const position = i + 1;
                const neighbor = siblings[i];
                return <option key={position} value={position}>
                  Platz {position}{position === 1 ? " · Ganz oben" : position === total ? " · Ganz unten" : ""}{neighbor ? ` · Vor: ${neighbor.title}` : ""}
                </option>;
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Ganz nach oben", target: 1, Icon: ChevronsUp, edge: rank === 1 },
              { label: "Einen Platz höher", target: rank - 1, Icon: ArrowUp, edge: rank === 1 },
              { label: "Einen Platz tiefer", target: rank + 1, Icon: ArrowDown, edge: rank === total },
              { label: "Ganz nach unten", target: total, Icon: ChevronsDown, edge: rank === total },
            ].map(({ label, target, Icon, edge }) => <button key={label} type="button" disabled={blocked || edge} onClick={() => choose(target)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-2 py-2 text-xs text-gray-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35">
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{label}
            </button>)}
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
            <p className="border-b border-white/10 px-4 py-2 text-xs text-gray-400">Reihenfolge nach dem Speichern · {tab}</p>
            <ol start={start + 1} aria-label="Vorschau der Reihenfolge" className="divide-y divide-white/5">
              {start > 0 && <li className="px-4 py-2 text-xs text-gray-500" aria-hidden="true">… {start} weitere davor</li>}
              {preview.slice(start, start + 5).map((p, index) => <li key={p.id} aria-current={p.id === "current" ? "true" : undefined}
                className={`flex items-center gap-3 px-4 py-3 ${p.id === "current" ? "bg-[#C2A878]/10 text-white" : "text-gray-400"}`}>
                <span className="w-6 shrink-0 text-right text-sm tabular-nums" aria-hidden="true">{start + index + 1}.</span>
                <span className="min-w-0 flex-1 break-words text-sm">{p.title}</span>
                {p.id === "current" && <span className="shrink-0 text-xs text-[#C2A878]">Diese Immobilie</span>}
              </li>)}
              {start + 5 < preview.length && <li className="px-4 py-2 text-xs text-gray-500" aria-hidden="true">… {preview.length - start - 5} weitere danach</li>}
            </ol>
          </div>
          {total === 1 && <p className="text-sm text-gray-400">Dies ist die erste Immobilie in „{tab}“.</p>}
        </>}
      <p id="property-position-hint" className="text-xs leading-relaxed text-gray-400">
        Wird erst mit „Speichern“ übernommen. Die anderen Immobilien rücken automatisch nach.
        Die Vorschau gilt ohne Besucherfilter; gleichzeitige Änderungen können die Position beeinflussen.
      </p>
    </div>
  );
}
