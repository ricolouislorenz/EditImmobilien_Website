import type { ContactFormData, ExposeRequestData } from "@/types";

const CONTACT_ENDPOINT = "/api/contact";
const EXPOSE_ENDPOINT = "/api/expose-request";

/** Sendet das allgemeine Kontaktformular an die Cloudflare Function. */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`E-Mail konnte nicht gesendet werden: ${body}`);
  }
}

/** Sendet eine Exposé-Anfrage für eine bestimmte Immobilie. */
export async function sendExposeRequest(
  data: ExposeRequestData
): Promise<void> {
  const res = await fetch(EXPOSE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Exposé-Anfrage konnte nicht gesendet werden: ${body}`);
  }
}
