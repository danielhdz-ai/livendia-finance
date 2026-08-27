-- Base helper usada por los triggers *_set_updated_at de las demás migraciones.
-- Debe existir antes de que cualquier migración adjunte el trigger (p. ej. notarias),
-- de modo que una base de datos nueva (supabase start / supabase db reset) se pueda
-- inicializar sin depender de que setup_database.sql se haya ejecutado antes.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
