-- Fortlaufende, menschenlesbare Objektnummer für Immobilien (z. B. "EI-005").
-- Wird nur intern (Admin-Panel) und in Exposé-Mails verwendet, nicht im Frontend.
--
-- Ausführen im Supabase SQL-Editor (Projekt -> SQL Editor -> New query).
-- Idempotent: kann gefahrlos erneut ausgeführt werden.

-- 1. Sequence für die laufende Nummer
create sequence if not exists properties_reference_seq;

-- 2. Spalte hinzufügen (zunächst nullable für den Backfill)
alter table properties
  add column if not exists reference text;

-- 3. Bestehende Zeilen nach Erstelldatum durchnummerieren
with ordered as (
  select id, row_number() over (order by created_at, id) as rn
  from properties
  where reference is null
)
update properties p
set reference = 'EI-' || lpad(o.rn::text, 3, '0')
from ordered o
where p.id = o.id;

-- 4. Sequence auf "nächste freie Nummer" setzen (is_called = false -> nextval liefert genau diesen Wert)
select setval(
  'properties_reference_seq',
  coalesce((select max(substring(reference from '\d+')::int) from properties), 0) + 1,
  false
);

-- 5. Default: neue Immobilien bekommen automatisch die nächste Nummer
alter table properties
  alter column reference set default 'EI-' || lpad(nextval('properties_reference_seq')::text, 3, '0');

-- 6. Pflichtfeld + Eindeutigkeit
alter table properties
  alter column reference set not null;

create unique index if not exists properties_reference_key on properties (reference);
