import { createClient } from '@supabase/supabase-js';
import { pathToFileURL } from 'node:url';

/** ÜBERGABE SPEICHER: Standard ist eine Vorschau. Dateien ausschließlich über Storage API löschen. */
export async function cleanupPropertyImages(client, { apply = false, log = console.log } = {}) {
  const { data, error } = await client.rpc('claim_property_image_cleanup', { p_dry_run: !apply, p_limit: 100 });
  if (error || !data || data.dry_run !== !apply || !Array.isArray(data.paths)
    || data.paths.length > 100 || data.paths.some((path) => typeof path !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9._-]+\.(jpe?g|png|webp)$/i.test(path))) {
    throw new Error('Bereinigungsprüfung fehlgeschlagen. Keine Storage-Löschung gestartet.');
  }
  log(`${apply ? 'Bereinigung' : 'Nur Vorschau'}: ${data.expired_entries} abgelaufene Papierkorbeinträge, ${data.paths.length} ungenutzte Bilder.`);
  if (!apply) { data.paths.forEach((path) => log(`Kandidat: ${path}`)); return; }
  if (data.paths.length === 0) return;
  const { data: removed, error: removeError } = await client.storage.from('property-images').remove(data.paths);
  const confirmed = new Set((removed ?? []).map((item) => item.name));
  if (removeError || data.paths.some((path) => !confirmed.has(path))) {
    throw new Error('Bildlöschung nicht vollständig bestätigt. Beim nächsten Lauf werden verbleibende Dateien erneut geprüft.');
  }
  log(`${data.paths.length} Bildlöschungen bestätigt.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY als Server-Secrets setzen.'); process.exitCode = 1;
  } else {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    try { await cleanupPropertyImages(client, { apply: process.env.CLEANUP_DELETE === 'true' }); }
    catch (error) { console.error(error instanceof Error ? error.message : 'Bereinigung fehlgeschlagen.'); process.exitCode = 1; }
  }
}
