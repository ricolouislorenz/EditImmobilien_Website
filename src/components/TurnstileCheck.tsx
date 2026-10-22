import { useEffect, useRef, useState } from "react";

interface TurnstileApi {
  ready: (callback: () => void) => void;
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (scriptPromise) return scriptPromise;
  if (window.turnstile) {
    const api = window.turnstile;
    return new Promise((resolve) => api.ready(() => resolve(api)));
  }
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timeout);
      script.onload = null;
      script.onerror = null;
      script.remove();
      scriptPromise = null;
      reject(new Error("Sicherheitsprüfung konnte nicht geladen werden."));
    }
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const api = window.turnstile;
      if (!api) return fail();
      try {
        api.ready(() => {
          window.clearTimeout(timeout);
          resolve(api);
        });
      } catch { fail(); }
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface Props {
  action: "contact" | "expose_request";
  refreshKey: number;
  onTokenChange: (token: string) => void;
}

/** Lädt den Schutz erst beim Öffnen des Formulars und verwirft abgelaufene/verwendete Tokens. */
export function TurnstileCheck({ action, refreshKey, onTokenChange }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | undefined;
    let api: TurnstileApi | undefined;
    onTokenChange("");
    setError(null);
    // In Produktions-Builds keinen öffentlich bekannten Dummy-Site-Key verwenden.
    if (!siteKey || (import.meta.env.PROD && /^[123]x0{20}/.test(siteKey))) {
      setError("Das Formular ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie uns telefonisch.");
      return;
    }
    const failed = () => {
      if (cancelled) return;
      onTokenChange("");
      setError("Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte erneut versuchen.");
    };
    loadTurnstile().then((loadedApi) => {
      if (cancelled || !container.current) return;
      api = loadedApi;
      widgetId = api.render(container.current, {
        sitekey: siteKey, action, theme: "dark", language: "de", size: "flexible",
        "response-field": false,
        "refresh-expired": "auto",
        callback: (token: string) => {
          if (cancelled) return;
          setError(null);
          onTokenChange(token);
        },
        "expired-callback": () => { if (!cancelled) onTokenChange(""); },
        "error-callback": failed,
        "timeout-callback": failed,
      });
    }).catch(failed);
    return () => {
      cancelled = true;
      onTokenChange("");
      if (widgetId !== undefined) api?.remove(widgetId);
    };
  }, [action, refreshKey, retry, onTokenChange]);

  return (
    <div className="min-w-0 space-y-2">
      <div ref={container} />
      {error && (
        <div role="alert" className="space-y-2 text-sm text-amber-200">
          <p>{error}</p>
          {siteKey && (
            <button type="button" className="underline" onClick={() => setRetry((value) => value + 1)}>
              Sicherheitsprüfung erneut starten
            </button>
          )}
        </div>
      )}
      <p className="text-xs text-gray-400">
        Spamschutz durch Cloudflare Turnstile. <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="underline">Datenschutz</a>
      </p>
    </div>
  );
}
