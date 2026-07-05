-- Tabla para guardar evaluaciones de calificación financiera
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  score integer not null check (score >= 0 and score <= 100),
  level text not null check (
    level in ('excelente', 'buena', 'regular', 'requiere-atencion')
  ),
  answers jsonb not null default '{}'::jsonb,
  category_scores jsonb not null default '{}'::jsonb,
  recommendations text[] not null default array[]::text[],
  created_at timestamptz not null default now()
);

create index if not exists evaluations_created_at_idx
  on public.evaluations (created_at desc);

create index if not exists evaluations_level_idx
  on public.evaluations (level);

alter table public.evaluations enable row level security;

-- Permite insertar evaluaciones desde la app (anon key)
create policy "Anyone can insert evaluations"
  on public.evaluations
  for insert
  to anon, authenticated
  with check (true);

-- Solo lectura para usuarios autenticados (panel futuro)
create policy "Authenticated users can read evaluations"
  on public.evaluations
  for select
  to authenticated
  using (true);
