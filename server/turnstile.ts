import { FormInputError } from "./form-validation.ts";

export interface TurnstileEnv {
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_ALLOWED_HOSTNAMES?: string;
}

// Öffentliche Cloudflare-Testschlüssel dürfen den produktiven Schutz nicht freischalten.
const TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

/** ÜBERGABE SICHERHEIT-03: Vor jedem Mailversand Nachweis, Domain und Formular prüfen. */
export async function verifyTurnstile(
  token: string,
  env: TurnstileEnv,
  action: "contact" | "expose_request",
): Promise<void> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  const hostnames = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",").map((hostname) => hostname.trim().toLowerCase()).filter(Boolean);
  if (!secret || TEST_SECRETS.has(secret) || hostnames.length === 0) {
    throw new FormInputError(503, "Das Formular ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie uns telefonisch.");
  }
  if (!token || token.length > 2048) {
    throw new FormInputError(403, "Bitte die Sicherheitsprüfung erneut abschließen.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let result: unknown;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Turnstile nicht erreichbar");
    result = await response.json();
  } catch {
    // Keine Schlüssel, Tokens oder Formulardaten protokollieren. Bei Ausfall keine Mail senden.
    throw new FormInputError(503, "Die Sicherheitsprüfung ist vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.");
  } finally {
    clearTimeout(timeout);
  }

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new FormInputError(503, "Die Sicherheitsprüfung ist vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.");
  }
  const verification = result as Record<string, unknown>;
  if (verification.success !== true || verification.action !== action ||
      typeof verification.hostname !== "string" || !hostnames.includes(verification.hostname.toLowerCase())) {
    throw new FormInputError(403, "Bitte die Sicherheitsprüfung erneut abschließen.");
  }
}
