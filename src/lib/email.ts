import type { ContactFormData, ExposeRequestData } from "@/types";

const CONTACT_ENDPOINT = "/api/contact";
const EXPOSE_ENDPOINT = "/api/expose-request";

async function assertEmailResponse(res: Response): Promise<void> {
  if (res.ok) return;
  const body: unknown = await res.json().catch(() => null);
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
    throw new Error(body.error);
  }
  throw new Error("Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
}

/** Sendet das allgemeine Kontaktformular an die Cloudflare Function. */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  await assertEmailResponse(res);
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

  await assertEmailResponse(res);
}
