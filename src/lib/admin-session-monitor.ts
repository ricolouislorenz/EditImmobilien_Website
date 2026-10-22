import { ADMIN_IDLE_MS, ADMIN_WARNING_MS, ADMIN_CHECK_MS, readActivity } from "./admin-session.ts";

export type SessionView = { phase: "checking" | "active" | "unavailable"; remainingMs: number };
type SessionResult = { status: "active" | "expired" | "replaced" | "ended"; remaining_seconds?: number };

/** ÜBERGABE ADMIN-SITZUNG: Bedienung zählt, automatische Token-Erneuerung zählt nicht. */
export function monitorAdminSession(options: {
  key: string;
  check: (activity: boolean) => Promise<SessionResult>;
  onState: (state: SessionView) => void;
  onEnd: (reason: string) => void;
  now?: () => number;
  win?: Window;
  doc?: Document;
}) {
  const now = options.now ?? Date.now;
  const win = options.win ?? window;
  const doc = options.doc ?? document;
  let lastActivity = readActivity(options.key, 0);
  let ready = false;
  let unavailable = false;
  let dirty = false;
  let busy = false;
  let stopped = false;
  let lastCheck = 0;
  const remaining = () => ADMIN_IDLE_MS - (now() - lastActivity);
  function end(reason: string) {
    if (stopped) return;
    stopped = true;
    options.onEnd(reason);
  }
  function view() {
    if (!stopped) options.onState({ phase: unavailable ? "unavailable" : !ready ? "checking" : "active", remainingMs: remaining() });
  }
  function expired() {
    lastActivity = readActivity(options.key, lastActivity);
    if (lastActivity > 0 && remaining() <= 0) {
      end("Du wurdest nach 30 Minuten ohne Bedienung abgemeldet. Bitte erneut anmelden. Ungespeicherte Änderungen wurden nicht gespeichert.");
      return true;
    }
    return false;
  }
  async function check() {
    if (stopped || busy || expired()) return;
    busy = true;
    lastCheck = now();
    const activitySent = dirty;
    dirty = false;
    try {
      const result = await options.check(activitySent);
      if (stopped) return;
      if (result.status !== "active") {
        end(result.status === "replaced"
          ? "Dieses Konto wurde erneut angemeldet. Die bisherige Sitzung wurde beendet. Ungespeicherte Änderungen wurden nicht gespeichert."
          : "Deine Sitzung ist abgelaufen oder wurde beendet. Bitte erneut anmelden. Ungespeicherte Änderungen wurden nicht gespeichert.");
        return;
      }
      if (typeof result.remaining_seconds !== "number" || !Number.isFinite(result.remaining_seconds)) throw new Error("Ungültige Sitzungsantwort");
      if (!lastActivity) lastActivity = now() - ADMIN_IDLE_MS + Math.min(ADMIN_IDLE_MS, result.remaining_seconds * 1000);
      ready = true;
      unavailable = false;
      if (!expired()) view();
    } catch {
      if (stopped) return;
      dirty ||= activitySent;
      unavailable = true;
      // Bei fehlender Einrichtung oder Verbindung keine Bedienung freigeben, Formular aber erhalten.
      options.onState({ phase: "unavailable", remainingMs: remaining() });
    } finally { busy = false; }
  }
  function activity() {
    if (stopped || !ready || unavailable || doc.visibilityState === "hidden" || expired()) return;
    if (now() - lastActivity < 1000) return;
    const wasWarning = remaining() <= ADMIN_WARNING_MS;
    lastActivity = now();
    dirty = true;
    try { localStorage.setItem(options.key, String(lastActivity)); } catch { /* Lokaler Timer funktioniert weiter. */ }
    view();
    if (wasWarning) void check();
  }
  function focus() { if (doc.visibilityState !== "hidden") void check(); }
  function storage(event: StorageEvent) {
    if (event.key !== options.key || !ready || stopped) return;
    const previous = lastActivity;
    lastActivity = readActivity(options.key, lastActivity);
    if (lastActivity > previous) dirty = true;
    if (!expired()) view();
  }
  const events = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
  events.forEach((event) => win.addEventListener(event, activity, { passive: true, capture: true }));
  win.addEventListener("focus", focus);
  win.addEventListener("storage", storage);
  doc.addEventListener("visibilitychange", focus);
  view();
  void check();
  const timer = win.setInterval(() => {
    if (stopped || expired()) return;
    view();
    if (now() - lastCheck >= ADMIN_CHECK_MS) void check();
  }, 1000);
  return {
    retry: () => { void check(); },
    stay: () => { activity(); void check(); },
    stop: () => {
      stopped = true;
      win.clearInterval(timer);
      events.forEach((event) => win.removeEventListener(event, activity, true));
      win.removeEventListener("focus", focus);
      win.removeEventListener("storage", storage);
      doc.removeEventListener("visibilitychange", focus);
    },
  };
}
