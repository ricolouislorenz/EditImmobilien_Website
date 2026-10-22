import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { positionSiblings, visiblePosition, sortOrderForPosition, type PositionProperty } from "@/lib/property-position";

export function PropertyPositionPicker({ properties, status, sortOrder, onChange, disabled, loading, error, onRetry }: {
  properties: PositionProperty[];
  status: string;
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
  const tab = status === "active" ? "Aktuell" : "Referenzen";
  const blocked = disabled || loading || error;
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
          <p className="text-sm text-gray-400" aria-live="polite" aria-atomic="true">{tab} · Platz {rank} von {total}</p>

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

        </>}
      <p id="property-position-hint" className="text-xs leading-relaxed text-gray-400">
        Wird erst mit „Speichern“ übernommen. Die anderen Immobilien rücken automatisch nach.
      </p>
    </div>
  );
}
