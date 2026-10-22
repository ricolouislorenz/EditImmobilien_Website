-- ÜBERGABE SICHERHEIT-05: Kontrolle nach dem Einstellen im Supabase-Dashboard.
-- Nur lesend; keine Dateilisten, Kundendaten oder Schlüssel.
-- Auch bei fehlendem Bucket erscheint eine Zeile mit bucket_vorhanden = false.
select
  b.id is not null as bucket_vorhanden,
  b.id as bucket,
  b.public as oeffentlich,
  b.file_size_limit as dateigroesse_max_bytes,
  coalesce(b.file_size_limit = 10000000, false) as groesse_exakt_wie_website,
  b.allowed_mime_types as erlaubte_dateitypen,
  coalesce(
    b.allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
    and b.allowed_mime_types <@ array['image/jpeg', 'image/png', 'image/webp']::text[]
    and cardinality(b.allowed_mime_types) = 3,
    false
  ) as formate_exakt_wie_website
from (values ('property-images'::text)) as ziel(id)
left join storage.buckets b on b.id = ziel.id;
