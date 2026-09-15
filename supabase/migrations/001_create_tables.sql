-- FitPulse — Initial schema
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- users -----------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null default 'user' check (role in ('user','admin')),
  age integer,
  gender text check (gender in ('male','female','other')),
  height_cm numeric(5,1),
  current_weight_kg numeric(5,1),
  target_weight_kg numeric(5,1),
  bmi numeric(4,1),
  goal text check (goal in ('weight_loss','muscle_gain','lean_body','strength','maintenance')),
  activity_level text check (activity_level in ('sedentary','light','moderate','very_active')),
  medical_conditions text[] default '{}',
  daily_calorie_target integer,
  protein_target_g integer,
  carb_target_g integer,
  fat_target_g integer,
  thyrox_dose_mg integer,
  avatar_url text,
  last_seen_plan_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Diet plans ------------------------------------------------------------
create table if not exists public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_name text not null default 'My plan',
  week_group text not null default 'week_1_2' check (week_group in ('week_1_2','week_3_4')),
  is_active boolean not null default true,
  source text not null default 'manual' check (source in ('manual','docx_import','admin_created')),
  updated_by uuid references public.users(id),
  plan_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.diet_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.diet_plans(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  meal_slot text not null check (meal_slot in (
    'detox_water','breakfast','snack1','lunch','chai','snack2',
    'pre_workout','post_workout','dinner')),
  food_item text not null,
  calories integer,
  protein_g numeric(5,1),
  carbs_g numeric(5,1),
  fat_g numeric(5,1),
  notes text,
  sort_order integer default 0
);

-- Exercise plans --------------------------------------------------------
create table if not exists public.exercise_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_name text not null default 'My workout',
  is_active boolean not null default true,
  updated_by uuid references public.users(id),
  plan_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.exercise_plans(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  exercise_name text not null,
  category text not null check (category in ('warmup','main','hiit','cooldown','abs','forearm')),
  sets integer,
  reps text,
  notes text,
  sort_order integer default 0
);

-- Daily logs -----------------------------------------------------------
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null,
  weight_kg numeric(5,1),
  water_glasses integer default 0,
  step_count integer,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null,
  meal_slot text not null,
  food_item text not null,
  calories integer,
  protein_g numeric(5,1),
  carbs_g numeric(5,1),
  fat_g numeric(5,1),
  photo_url text,
  source text check (source in ('manual','photo_ai','plan_default')),
  ai_analysis_raw jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null,
  exercise_name text not null,
  planned_sets integer,
  actual_sets integer,
  planned_reps text,
  actual_reps text,
  weight_used_kg numeric(5,1),
  is_completed boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  photo_date date not null,
  angle text check (angle in ('front','side','back')),
  photo_url text not null,
  weight_at_time numeric(5,1),
  created_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  measure_date date not null,
  waist_cm numeric(5,1),
  chest_cm numeric(5,1),
  hips_cm numeric(5,1),
  left_arm_cm numeric(5,1),
  right_arm_cm numeric(5,1),
  left_thigh_cm numeric(5,1),
  right_thigh_cm numeric(5,1)
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.users(id),
  target_user_id uuid not null references public.users(id),
  action_type text not null check (action_type in ('plan_edit','target_change','plan_import','plan_delete')),
  action_detail jsonb,
  created_at timestamptz not null default now()
);

-- Indexes ---------------------------------------------------------------
create index if not exists idx_diet_items_plan on public.diet_plan_items(plan_id, day_of_week);
create index if not exists idx_exercise_items_plan on public.exercise_plan_items(plan_id, day_of_week);
create index if not exists idx_meal_logs_user_date on public.meal_logs(user_id, log_date);
create index if not exists idx_exercise_logs_user_date on public.exercise_logs(user_id, log_date);
create index if not exists idx_daily_logs_user_date on public.daily_logs(user_id, log_date);
