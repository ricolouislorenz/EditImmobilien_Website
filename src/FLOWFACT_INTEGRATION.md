# Flowfact Mini Integration - Anleitung

## Übersicht
Die Exposé-Anforderungs-Funktion ist bereits im Frontend implementiert. Um die vollständige Integration mit Flowfact Mini zu aktivieren, benötigen Sie ein Backend.

## Aktuelle Implementierung

### ✅ Frontend (bereits implementiert)
- **PropertyCard**: Zeigt "Exposé anfordern"-Button beim Hover (nur für aktuelle Angebote)
- **ExposeRequestDialog**: Modal-Dialog mit Formular für Kundendaten
- **Toast-Benachrichtigungen**: Erfolgs-/Fehlermeldungen

### ⏳ Backend-Integration (benötigt)

## Flowfact Mini API-Integration

### Schritt 1: Flowfact API-Zugangsdaten
Sie benötigen von Flowfact:
- **API-Key** / **Client ID**
- **API-Secret** / **Client Secret**
- **API-Endpoint**: Üblicherweise `https://api.flowfact.com` oder Ihre spezifische Instanz

### Schritt 2: Backend-Setup

#### Option A: Supabase Edge Functions (empfohlen)
1. Supabase-Projekt verbinden
2. Edge Function erstellen:

```typescript
// supabase/functions/request-expose/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { propertyId, customerData } = await req.json();
  
  // Flowfact API-Aufruf
  const flowfactResponse = await fetch(
    'https://api.flowfact.com/expose/request', // Ihr Flowfact-Endpoint
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FLOWFACT_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entityId: propertyId,
        contact: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          message: customerData.message,
        }
      })
    }
  );

  const data = await flowfactResponse.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

3. Environment-Variable setzen:
```bash
supabase secrets set FLOWFACT_API_KEY=ihr_api_key
```

4. Frontend anpassen (`/components/ExposeRequestDialog.tsx`):
```typescript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/request-expose`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      propertyId: propertyId,
      customerData: formData,
    }),
  }
);
```

#### Option B: Eigener Backend-Server
Node.js/Express-Beispiel:

```javascript
// server.js
app.post('/api/flowfact/request-expose', async (req, res) => {
  const { propertyId, customerData } = req.body;
  
  try {
    const response = await axios.post(
      'https://api.flowfact.com/expose/request',
      {
        entityId: propertyId,
        contact: customerData
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.FLOWFACT_API_KEY}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Schritt 3: Flowfact Mini Spezifika

Flowfact Mini verwendet möglicherweise spezifische Endpoints. Häufige Optionen:

1. **Kontakt erstellen**:
```
POST /contacts
Body: { firstName, lastName, email, phone, ... }
```

2. **Exposé-Anfrage**:
```
POST /estates/{estateId}/expose-request
Body: { contactId, message, ... }
```

3. **Lead-Generierung**:
```
POST /leads
Body: { estateId, contactData, source: "website", ... }
```

### Schritt 4: Property-IDs synchronisieren

Stellen Sie sicher, dass die IDs in `/components/PropertiesSection.tsx` mit Ihren Flowfact-Entity-IDs übereinstimmen:

```typescript
const currentProperties = [
  {
    id: 12345, // ← Ihre echte Flowfact Entity-ID
    title: "Moderne Villa",
    // ...
  }
];
```

## Erweiterte Funktionen

### A. Automatische E-Mail-Benachrichtigungen
```typescript
// In der Edge Function
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
  },
  body: JSON.stringify({
    from: 'info@edit-immobilien.de',
    to: customerData.email,
    subject: 'Ihr angefordertes Exposé',
    html: exposeEmailTemplate,
  })
});
```

### B. CRM-Integration speichern
```typescript
// Anfrage in Supabase-Datenbank speichern
await supabase
  .from('expose_requests')
  .insert({
    property_id: propertyId,
    customer_name: customerData.name,
    customer_email: customerData.email,
    customer_phone: customerData.phone,
    message: customerData.message,
    status: 'pending',
    created_at: new Date(),
  });
```

### C. PDF-Generierung
Falls Flowfact nicht direkt PDFs versendet:
```typescript
import puppeteer from "puppeteer";

const pdf = await puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto(`https://expose-template.com/${propertyId}`);
  const pdfBuffer = await page.pdf();
  await browser.close();
  return pdfBuffer;
});
```

## Testen

### Mock-Modus (aktuell aktiv)
Die App funktioniert bereits im Demo-Modus ohne echte API-Calls.

### Test mit echten Daten
1. Backend-Endpoint deployen
2. API-Keys konfigurieren
3. `ExposeRequestDialog.tsx` aktualisieren
4. Test-Anfrage senden

## Sicherheit

⚠️ **Wichtig**:
- API-Keys NIEMALS im Frontend-Code speichern
- Immer HTTPS verwenden
- Rate-Limiting implementieren
- Input-Validierung auf Backend-Seite
- DSGVO-konforme Datenspeicherung

## Support

Flowfact-Dokumentation: https://developer.flowfact.com
Kontakt: support@flowfact.de
