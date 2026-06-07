-- Einfügen an einer bestimmten Position in der Sortier-Reihenfolge.
-- Wird die Reihenfolge einer Immobilie auf eine bereits belegte Position gesetzt,
-- rücken alle Immobilien an/ab dieser Position um eins nach hinten.
-- Beispiel: Ziel = 3, vorhanden 3..10  ->  diese werden zu 4..11, die aktuelle bleibt auf 3.
--
-- Ausführen im Supabase SQL-Editor. Idempotent (create or replace).

create or replace function shift_property_order(p_target int, p_exclude uuid)
returns void
language plpgsql
as $$
begin
  -- Nur verschieben, wenn die Zielposition bereits von einer anderen Immobilie belegt ist.
  if exists (
    select 1 from properties
    where sort_order = p_target and id <> p_exclude
  ) then
    update properties
      set sort_order = sort_order + 1,
          updated_at = now()
      where sort_order >= p_target and id <> p_exclude;
  end if;
end;
$$;

grant execute on function shift_property_order(int, uuid) to authenticated;
