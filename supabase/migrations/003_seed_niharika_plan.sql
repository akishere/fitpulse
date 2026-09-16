-- Seed Niharika's diet + exercise plan
--
-- HOW TO USE
--   1. Find Niharika's user id in Supabase (Authentication → Users, or run:
--        select id, email from public.users where email ilike '%niharika%';
--      )
--   2. Replace the placeholder v_user_id below with her uuid, then run the
--      whole file in the SQL editor. Safe to re-run — deactivates old plans
--      first, then inserts fresh ones.

do $$
declare
  v_user_id uuid := '00000000-0000-0000-0000-000000000000';  -- <<< REPLACE ME
  v_diet_id uuid;
  v_ex_id   uuid;
begin
  if v_user_id = '00000000-0000-0000-0000-000000000000' then
    raise exception 'Replace v_user_id at the top of this script with Niharika''s uuid.';
  end if;

  -- Profile touch-ups: hypothyroidism + Thyrox 50 mg per PRD
  update public.users
     set medical_conditions = array['hypothyroidism'],
         thyrox_dose_mg     = coalesce(thyrox_dose_mg, 50),
         updated_at         = now()
   where id = v_user_id;

  -- Deactivate any prior plans so this is idempotent
  update public.diet_plans     set is_active = false where user_id = v_user_id;
  update public.exercise_plans set is_active = false where user_id = v_user_id;

  ----------------------------------------------------------------------------
  -- Diet plan
  ----------------------------------------------------------------------------
  insert into public.diet_plans
    (user_id, plan_name, week_group, is_active, source, updated_by, plan_updated_at)
  values
    (v_user_id, 'Niharika weekly plan', 'week_1_2', true, 'admin_created', v_user_id, now())
  returning id into v_diet_id;

  insert into public.diet_plan_items
    (plan_id, day_of_week, meal_slot, food_item, calories, protein_g, carbs_g, fat_g, sort_order)
  values
    -- Monday (0)
    (v_diet_id, 0, 'detox_water', 'Warm water + lemon + soaked methi seeds',            10,  0.2,  2,   0,   0),
    (v_diet_id, 0, 'breakfast',   'Vegetable poha with peanuts + moong sprouts',       360, 14,   52, 10,   1),
    (v_diet_id, 0, 'snack1',      '1 apple + 8 almonds',                               180,  4,   25,  7,   2),
    (v_diet_id, 0, 'lunch',       '2 jowar roti + palak paneer + salad',               520, 24,   55, 20,   3),
    (v_diet_id, 0, 'chai',        'Green tea + roasted chana',                         120,  6,   15,  3,   4),
    (v_diet_id, 0, 'snack2',      'Cucumber + hummus',                                 150,  6,   14,  8,   5),
    (v_diet_id, 0, 'dinner',      'Moong dal khichdi + curd + beetroot salad',         430, 20,   60, 10,   6),

    -- Tuesday (1)
    (v_diet_id, 1, 'detox_water', 'Jeera water',                                         5,  0,    1,  0,   0),
    (v_diet_id, 1, 'breakfast',   'Besan chilla + mint chutney',                       340, 18,   32, 12,   1),
    (v_diet_id, 1, 'snack1',      'Buttermilk + roasted makhana',                      160,  5,   22,  5,   2),
    (v_diet_id, 1, 'lunch',       'Brown rice + rajma + kachumber salad',              540, 22,   75, 12,   3),
    (v_diet_id, 1, 'chai',        'Masala tea (no sugar) + 2 khakra',                  130,  4,   20,  4,   4),
    (v_diet_id, 1, 'snack2',      'Paneer tikka (6 pcs)',                              170, 20,    4,  8,   5),
    (v_diet_id, 1, 'dinner',      'Vegetable soup + tofu bhurji + 1 roti',             400, 24,   32, 14,   6),

    -- Wednesday (2)
    (v_diet_id, 2, 'detox_water', 'Cinnamon + tulsi water',                              5,  0,    1,  0,   0),
    (v_diet_id, 2, 'breakfast',   'Oats upma + peanuts',                               350, 14,   50, 10,   1),
    (v_diet_id, 2, 'snack1',      'Papaya bowl + chia seeds',                          160,  4,   30,  4,   2),
    (v_diet_id, 2, 'lunch',       'Bajra roti + baingan bharta + curd',                500, 20,   58, 18,   3),
    (v_diet_id, 2, 'pre_workout', '1 banana + black coffee',                           130,  2,   28,  1,   4),
    (v_diet_id, 2, 'post_workout','Soy protein shake + 1 date',                        180, 24,   12,  3,   5),
    (v_diet_id, 2, 'dinner',      'Grilled paneer + sauteed veggies',                  420, 26,   18, 22,   6),

    -- Thursday (3)
    (v_diet_id, 3, 'detox_water', 'Warm water + ACV',                                    5,  0,    1,  0,   0),
    (v_diet_id, 3, 'breakfast',   'Moong dal chilla + paneer stuffing',                380, 22,   30, 14,   1),
    (v_diet_id, 3, 'snack1',      'Guava + walnuts (4 halves)',                        170,  4,   22,  8,   2),
    (v_diet_id, 3, 'lunch',       'Quinoa pulao + kadhi + salad',                      520, 20,   68, 14,   3),
    (v_diet_id, 3, 'chai',        'Ginger tea + 6 almonds',                            110,  3,   10,  6,   4),
    (v_diet_id, 3, 'snack2',      'Sprouts chaat (moong + chana)',                     190, 12,   24,  4,   5),
    (v_diet_id, 3, 'dinner',      'Mixed veg curry + jowar roti + curd',               420, 18,   50, 12,   6),

    -- Friday (4)
    (v_diet_id, 4, 'detox_water', 'Warm water + soaked chia',                           30,  1,    3,  2,   0),
    (v_diet_id, 4, 'breakfast',   'Vegetable dalia + curd',                            360, 15,   55,  8,   1),
    (v_diet_id, 4, 'snack1',      'Watermelon bowl + 8 pistachios',                    160,  4,   26,  6,   2),
    (v_diet_id, 4, 'lunch',       '2 phulka + chana masala + salad',                   520, 22,   68, 12,   3),
    (v_diet_id, 4, 'chai',        'Green tea + 2 dates',                               100,  1,   22,  1,   4),
    (v_diet_id, 4, 'snack2',      'Cottage cheese salad',                              210, 20,   10, 10,   5),
    (v_diet_id, 4, 'dinner',      'Palak soup + tofu tikka + salad',                   380, 25,   20, 18,   6),

    -- Saturday (5)
    (v_diet_id, 5, 'detox_water', 'Cucumber + mint water',                               5,  0,    1,  0,   0),
    (v_diet_id, 5, 'breakfast',   'Idli + sambhar + coconut chutney',                  380, 15,   62,  8,   1),
    (v_diet_id, 5, 'snack1',      'Orange + 8 almonds',                                170,  4,   25,  7,   2),
    (v_diet_id, 5, 'lunch',       'Vegetable biryani (brown rice) + raita',            560, 20,   78, 14,   3),
    (v_diet_id, 5, 'chai',        'Elaichi tea + roasted seeds',                       130,  5,   12,  6,   4),
    (v_diet_id, 5, 'snack2',      'Paneer + veg salad',                                220, 20,   10, 12,   5),
    (v_diet_id, 5, 'dinner',      'Grilled veggies + mushroom curry + 1 roti',         400, 20,   42, 14,   6),

    -- Sunday (6)
    (v_diet_id, 6, 'detox_water', 'Warm water + amla juice',                            20,  0,    4,  0,   0),
    (v_diet_id, 6, 'breakfast',   'Multigrain paratha + curd + pickle',                400, 14,   55, 14,   1),
    (v_diet_id, 6, 'snack1',      'Pomegranate + mixed nuts',                          180,  5,   25,  8,   2),
    (v_diet_id, 6, 'lunch',       'Dal tadka + jeera rice + salad',                    520, 22,   78, 10,   3),
    (v_diet_id, 6, 'chai',        'Herbal tea + 2 khakra',                             120,  3,   20,  3,   4),
    (v_diet_id, 6, 'snack2',      'Fruit chaat',                                       160,  3,   34,  2,   5),
    (v_diet_id, 6, 'dinner',      'Mixed veg soup + paneer bhurji roll',               420, 25,   34, 16,   6);

  ----------------------------------------------------------------------------
  -- Exercise plan
  ----------------------------------------------------------------------------
  insert into public.exercise_plans
    (user_id, plan_name, is_active, updated_by, plan_updated_at)
  values
    (v_user_id, 'Niharika weekly workout', true, v_user_id, now())
  returning id into v_ex_id;

  insert into public.exercise_plan_items
    (plan_id, day_of_week, exercise_name, category, sets, reps, notes, sort_order)
  values
    -- Monday — Push
    (v_ex_id, 0, 'Treadmill warmup',           'warmup', 1, '8 min',              'Zone 2, incline 3',            0),
    (v_ex_id, 0, 'Dumbbell bench press',       'main',   4, '10-12',              'Start with 6-8 kg per hand',   1),
    (v_ex_id, 0, 'Incline machine press',      'main',   3, '10',                 null,                           2),
    (v_ex_id, 0, 'Cable chest fly',            'main',   3, '12-15',              null,                           3),
    (v_ex_id, 0, 'Overhead shoulder press',    'main',   3, '10',                 null,                           4),
    (v_ex_id, 0, 'Tricep rope pushdown',       'main',   3, '12',                 null,                           5),
    (v_ex_id, 0, 'HIIT: Bike sprints',         'hiit',   6, '30s on / 30s off',   null,                           6),
    (v_ex_id, 0, 'Plank hold',                 'abs',    3, '45s',                null,                           7),

    -- Tuesday — Pull
    (v_ex_id, 1, 'Rowing machine',             'warmup', 1, '6 min',              null,                           0),
    (v_ex_id, 1, 'Lat pulldown',               'main',   4, '10-12',              null,                           1),
    (v_ex_id, 1, 'Seated cable row',           'main',   3, '10',                 null,                           2),
    (v_ex_id, 1, 'Face pulls',                 'main',   3, '15',                 null,                           3),
    (v_ex_id, 1, 'Bicep curls (DB)',           'main',   3, '12',                 null,                           4),
    (v_ex_id, 1, 'Farmer carry',               'forearm',3, '40s',                null,                           5),
    (v_ex_id, 1, 'HIIT: Battle ropes',         'hiit',   5, '30s on / 30s off',   null,                           6),

    -- Wednesday — Legs
    (v_ex_id, 2, 'Bike warmup',                'warmup', 1, '8 min',              null,                           0),
    (v_ex_id, 2, 'Goblet squat',               'main',   4, '12',                 null,                           1),
    (v_ex_id, 2, 'Romanian deadlift',          'main',   4, '10',                 'Slow eccentric',               2),
    (v_ex_id, 2, 'Walking lunges',             'main',   3, '16 steps',           null,                           3),
    (v_ex_id, 2, 'Leg curl machine',           'main',   3, '12',                 null,                           4),
    (v_ex_id, 2, 'Standing calf raise',        'main',   4, '15',                 null,                           5),
    (v_ex_id, 2, 'HIIT: Assault bike',         'hiit',   8, '20s on / 40s off',   null,                           6),

    -- Thursday — Cardio + Abs
    (v_ex_id, 3, 'Skipping rope',              'warmup', 3, '2 min',              null,                           0),
    (v_ex_id, 3, 'Treadmill run intervals',    'hiit',   6, '1 min fast / 1 min slow', null,                      1),
    (v_ex_id, 3, 'Hanging knee raise',         'abs',    4, '12',                 null,                           2),
    (v_ex_id, 3, 'Cable woodchopper',          'abs',    3, '12/side',            null,                           3),
    (v_ex_id, 3, 'Russian twists',             'abs',    3, '30',                 null,                           4),
    (v_ex_id, 3, 'Stretch cooldown',           'cooldown',1,'8 min',              null,                           5),

    -- Friday — Full body
    (v_ex_id, 4, 'Rowing',                     'warmup', 1, '7 min',              null,                           0),
    (v_ex_id, 4, 'Deadlift',                   'main',   4, '6',                  'Focus on form, not load',      1),
    (v_ex_id, 4, 'Push-ups',                   'main',   4, 'AMRAP',              null,                           2),
    (v_ex_id, 4, 'Assisted pull-ups',          'main',   4, '6-8',                null,                           3),
    (v_ex_id, 4, 'Kettlebell swings',          'hiit',   5, '20',                 null,                           4),
    (v_ex_id, 4, 'Plank',                      'abs',    3, '60s',                null,                           5),

    -- Saturday — Active recovery
    (v_ex_id, 5, 'Yoga flow',                  'warmup', 1, '20 min',             null,                           0),
    (v_ex_id, 5, 'Brisk walk',                 'main',   1, '40 min',             null,                           1),
    (v_ex_id, 5, 'Mobility drills',            'cooldown',1,'10 min',             null,                           2);

  -- Sunday (6) intentionally empty — rest day

  raise notice 'Seeded Niharika: diet_plan %, exercise_plan %', v_diet_id, v_ex_id;
end $$;
