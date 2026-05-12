interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL?: string;
  RESEND_FROM?: string;
}

interface ExposePayload {
  name?: string;
  email?: string;
  phone?: string;
  property_id?: string;
  property_title?: string;
}

const DEFAULT_FROM = "Edit Immobilien <kontakt@edit-immobilien.de>";
const DEFAULT_TO = "kontakt@edit-immobilien.de";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return jsonResponse(500, { error: "Mailversand nicht konfiguriert." });
  }

  let payload: ExposePayload;
  try {
    payload = (await request.json()) as ExposePayload;
  } catch {
    return jsonResponse(400, { error: "Ungültiges JSON." });
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const phone = (payload.phone ?? "").trim();
  const propertyId = (payload.property_id ?? "").trim();
  const propertyTitle = (payload.property_title ?? "").trim();

  if (!name || name.length > 200) {
    return jsonResponse(400, { error: "Name fehlt oder ist zu lang." });
  }
  if (!EMAIL_REGEX.test(email) || email.length > 200) {
    return jsonResponse(400, { error: "Ungültige E-Mail-Adresse." });
  }
  if (phone.length > 50) {
    return jsonResponse(400, { error: "Telefonnummer zu lang." });
  }
  if (!propertyId || propertyId.length > 100) {
    return jsonResponse(400, { error: "Immobilie fehlt oder ungültig." });
  }
  if (!propertyTitle || propertyTitle.length > 300) {
    return jsonResponse(400, { error: "Immobilien-Titel fehlt oder zu lang." });
  }

  const to = env.CONTACT_EMAIL ?? DEFAULT_TO;
  const from = env.RESEND_FROM ?? DEFAULT_FROM;

  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#111111;">Neue Exposé-Anfrage</h2>
    <p style="font-family:Arial,sans-serif;color:#111111;"><strong>Immobilie:</strong> ${escapeHtml(propertyTitle)}</p>
    <p style="font-family:Arial,sans-serif;color:#6B4F3A;font-size:12px;"><strong>Objekt-ID:</strong> ${escapeHtml(propertyId)}</p>
    <hr style="border:none;border-top:1px solid #E8E0D8;margin:16px 0;" />
    <p style="font-family:Arial,sans-serif;color:#111111;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="font-family:Arial,sans-serif;color:#111111;"><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p style="font-family:Arial,sans-serif;color:#111111;"><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
  `;

  const text = [
    "Neue Exposé-Anfrage",
    "",
    `Immobilie: ${propertyTitle}`,
    `Objekt-ID: ${propertyId}`,
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    phone ? `Telefon: ${phone}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `Exposé-Anfrage: ${propertyTitle}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error", res.status, body);
    return jsonResponse(502, { error: "Mailversand fehlgeschlagen." });
  }

  return jsonResponse(200, { ok: true });
}
