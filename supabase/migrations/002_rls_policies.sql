-- FitPulse — Row Level Security
-- Applies after tables exist.

alter table public.users enable row level security;
alter table public.diet_plans enable row level security;
alter table public.diet_plan_items enable row level security;
alter table public.exercise_plans enable row level security;
alter table public.exercise_plan_items enable row level security;
alter table public.daily_logs enable row level security;
alter table public.meal_logs enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.progress_photos enable row level security;
alter table public.body_measurements enable row level security;
alter table public.admin_audit_log enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- users -----------------------------------------------------------------
drop policy if exists "users read own or admin" on public.users;
create policy "users read own or admin"
  on public.users for select
  using ( id = auth.uid() or public.is_admin() );

drop policy if exists "users update own" on public.users;
create policy "users update own"
  on public.users for update
  using ( id = auth.uid() or public.is_admin() );

drop policy if exists "users insert self" on public.users;
create policy "users insert self"
  on public.users for insert
  with check ( id = auth.uid() );

-- Owner + admin helper for user_id columns
do $body$
declare t record;
begin
  for t in (values
    ('diet_plans'), ('exercise_plans'), ('daily_logs'),
    ('meal_logs'), ('exercise_logs'), ('progress_photos'),
    ('body_measurements')
  ) loop
    execute format('drop policy if exists "own or admin" on public.%I;', t.column1);
    execute format($$
      create policy "own or admin"
        on public.%I for all
        using ( user_id = auth.uid() or public.is_admin() )
        with check ( user_id = auth.uid() or public.is_admin() );
    $$, t.column1);
  end loop;
end $body$;

-- diet_plan_items and exercise_plan_items go through their plan.
drop policy if exists "diet items via plan" on public.diet_plan_items;
create policy "diet items via plan"
  on public.diet_plan_items for all
  using (
    exists (
      select 1 from public.diet_plans p
      where p.id = diet_plan_items.plan_id
        and (p.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.diet_plans p
      where p.id = diet_plan_items.plan_id
        and (p.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "exercise items via plan" on public.exercise_plan_items;
create policy "exercise items via plan"
  on public.exercise_plan_items for all
  using (
    exists (
      select 1 from public.exercise_plans p
      where p.id = exercise_plan_items.plan_id
        and (p.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.exercise_plans p
      where p.id = exercise_plan_items.plan_id
        and (p.user_id = auth.uid() or public.is_admin())
    )
  );

-- Audit log: admin insert + admin read only, never update/delete.
drop policy if exists "audit admin insert" on public.admin_audit_log;
create policy "audit admin insert"
  on public.admin_audit_log for insert
  with check ( public.is_admin() and admin_user_id = auth.uid() );

drop policy if exists "audit admin read" on public.admin_audit_log;
create policy "audit admin read"
  on public.admin_audit_log for select
  using ( public.is_admin() );
