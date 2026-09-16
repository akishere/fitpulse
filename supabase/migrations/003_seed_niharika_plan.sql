-- ============================================================
-- FitPulse: Niharika's complete plan seed
--   • Diet plan — Week 1-2 (no rice, thyroid-safe)
--   • Diet plan — Week 3-4 (no rice, thyroid-safe)
--   • Exercise plan — full week
--
-- Idempotent: safe to run many times. The DO block runs as a single
-- transaction — any failure rolls back the whole seed. Prior plans for
-- this user are deleted first (FK ON DELETE CASCADE wipes their items).
--
-- Change the v_user_id at the top if you seed for a different user.
-- ============================================================

do $body$
declare
  v_user_id  uuid := 'c7d4d6df-ff7e-4939-bdf3-a9c45e48075f';  -- Niharika
  v_diet_w12 uuid;
  v_diet_w34 uuid;
  v_ex_plan  uuid;
begin
  -- Sanity check
  if not exists (select 1 from public.users where id = v_user_id) then
    raise exception 'User % not found in public.users. Confirm they signed up and completed onboarding.', v_user_id;
  end if;

  ----------------------------------------------------------------------------
  -- Wipe prior plans for this user (FK cascade removes items).
  ----------------------------------------------------------------------------
  delete from public.diet_plans     where user_id = v_user_id;
  delete from public.exercise_plans where user_id = v_user_id;

  ----------------------------------------------------------------------------
  -- Profile touch-ups per PRD: hypothyroidism, Thyrox 50 mg
  ----------------------------------------------------------------------------
  update public.users
     set medical_conditions = array['hypothyroidism'],
         thyrox_dose_mg     = coalesce(thyrox_dose_mg, 50),
         updated_at         = now()
   where id = v_user_id;

  ----------------------------------------------------------------------------
  -- DIET PLAN — Week 1-2
  ----------------------------------------------------------------------------
  insert into public.diet_plans
    (user_id, plan_name, week_group, is_active, source, updated_by, plan_updated_at)
  values
    (v_user_id, 'Trainer Plan — Week 1-2 (No Rice)', 'week_1_2', true, 'admin_created', v_user_id, now())
  returning id into v_diet_w12;

  insert into public.diet_plan_items
    (plan_id, day_of_week, meal_slot, food_item, calories, protein_g, carbs_g, fat_g, notes, sort_order)
  values
    -- MONDAY (0)
    (v_diet_w12, 0, 'detox_water', 'Jeera (cumin) water — 1 tsp cumin seeds soaked overnight, drink water in morning', 5, 0, 1, 0, 'Sip slowly on empty stomach. 45 min after Thyrox.', 1),
    (v_diet_w12, 0, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 apple', 220, 28, 20, 2, 'No milk. Eat fruit separately, do not blend.', 2),
    (v_diet_w12, 0, 'chai',        '1 cup ginger chai — max 1 tsp sugar or jaggery', 40, 1, 8, 1, 'ONLY after breakfast. Min 2.5 hrs after Thyrox. Never empty stomach.', 3),
    (v_diet_w12, 0, 'snack1',      '30g roasted chana + lemon juice', 120, 7, 17, 3, '', 4),
    (v_diet_w12, 0, 'lunch',       '2 multigrain roti + toor dal + bhindi sabzi + cucumber-onion salad + curd (100g)', 450, 20, 52, 12, 'NO RICE. Generous salad with meals. Homemade curd.', 5),
    (v_diet_w12, 0, 'snack2',      '1 cucumber + 2 tbsp hummus', 100, 4, 10, 5, 'Light pre-workout prep.', 6),
    (v_diet_w12, 0, 'pre_workout', '3-4 dates (khajoor) + 200ml coconut water', 130, 1, 32, 0, '30-40 min before gym. No banana.', 7),
    (v_diet_w12, 0, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, 'No milk. No banana. Within 30 min of finishing gym.', 8),
    (v_diet_w12, 0, 'dinner',      'Lauki soup + sauteed vegetables + grilled paneer (100g)', 320, 22, 18, 16, 'Light dinner. Paneer daily. Minimal oil for sauté.', 9),

    -- TUESDAY (1)
    (v_diet_w12, 1, 'detox_water', 'Saunf (fennel) water — 1 tsp fennel seeds soaked overnight', 5, 0, 1, 0, 'Sip slowly. 45 min after Thyrox.', 1),
    (v_diet_w12, 1, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 guava', 210, 28, 18, 2, 'No milk. Eat fruit separately.', 2),
    (v_diet_w12, 1, 'chai',        '1 cup tulsi chai — max 1 tsp jaggery', 40, 1, 8, 1, 'After breakfast only.', 3),
    (v_diet_w12, 1, 'snack1',      'Sprouts chaat bowl + lemon squeeze', 130, 8, 18, 2, '', 4),
    (v_diet_w12, 1, 'lunch',       '2 multigrain roti + rajma (half cup) + salad + curd (100g)', 440, 22, 50, 10, 'NO RICE. Rajma with roti instead of rice.', 5),
    (v_diet_w12, 1, 'snack2',      '5 walnuts + 1 small apple', 150, 3, 18, 8, '', 6),
    (v_diet_w12, 1, 'pre_workout', '3-4 dates + warm water + pinch cinnamon', 90, 1, 22, 0, '30 min before gym.', 7),
    (v_diet_w12, 1, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, 'No milk. No banana.', 8),
    (v_diet_w12, 1, 'dinner',      'Tomato soup + sauteed paneer (100g) + green salad', 300, 22, 15, 14, 'Light dinner. Homemade soup.', 9),

    -- WEDNESDAY (2)
    (v_diet_w12, 2, 'detox_water', 'Methi (fenugreek) water — half tsp methi seeds soaked overnight, drink water + chew seeds', 5, 0, 1, 0, 'Good for thyroid and blood sugar. 45 min after Thyrox.', 1),
    (v_diet_w12, 2, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 kiwi', 215, 28, 16, 2, 'No milk.', 2),
    (v_diet_w12, 2, 'chai',        '1 cup ginger chai — max 1 tsp sugar', 40, 1, 8, 1, 'After breakfast only.', 3),
    (v_diet_w12, 2, 'snack1',      '1 orange + 10 almonds', 140, 4, 16, 8, '', 4),
    (v_diet_w12, 2, 'lunch',       '2 multigrain roti + paneer bhurji (100g paneer) + salad + curd (100g)', 470, 28, 42, 18, 'NO RICE. Homemade paneer. Low-fat milk.', 5),
    (v_diet_w12, 2, 'snack2',      '1 small besan cheela + mint chutney', 120, 8, 12, 4, '', 6),
    (v_diet_w12, 2, 'pre_workout', '3-4 dates + 200ml coconut water', 130, 1, 32, 0, '30-40 min before gym.', 7),
    (v_diet_w12, 2, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, 'No milk. No banana.', 8),
    (v_diet_w12, 2, 'dinner',      'Kaddu (pumpkin) soup + sauteed vegetables + paneer (80g)', 290, 18, 22, 14, 'Light dinner. Minimal oil.', 9),

    -- THURSDAY (3)
    (v_diet_w12, 3, 'detox_water', 'Dhaniya (coriander) water — 1 tsp coriander seeds soaked overnight', 5, 0, 1, 0, 'Sip slowly. 45 min after Thyrox.', 1),
    (v_diet_w12, 3, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 orange', 210, 28, 18, 2, 'No milk.', 2),
    (v_diet_w12, 3, 'chai',        '1 cup tulsi chai — max 1 tsp jaggery', 40, 1, 8, 1, 'After breakfast only.', 3),
    (v_diet_w12, 3, 'snack1',      '10 almonds + 2 walnut halves', 130, 5, 4, 11, 'From trainer 4 PM snack rotation.', 4),
    (v_diet_w12, 3, 'lunch',       '2 multigrain roti + moong dal + sabzi + cucumber-onion salad + curd (100g)', 430, 20, 48, 12, 'NO RICE. Green moong dal preferred.', 5),
    (v_diet_w12, 3, 'snack2',      '2 tbsp hummus + cucumber sticks', 100, 4, 10, 5, '', 6),
    (v_diet_w12, 3, 'pre_workout', '3-4 dates + warm water', 90, 1, 22, 0, '30 min before gym.', 7),
    (v_diet_w12, 3, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, 'No milk. No banana.', 8),
    (v_diet_w12, 3, 'dinner',      'Clear vegetable soup + grilled paneer (100g) + salad', 310, 22, 16, 15, 'Light dinner.', 9),

    -- FRIDAY (4)
    (v_diet_w12, 4, 'detox_water', 'Ginger water — 1 inch fresh ginger boiled in 1.5 glasses water for 5 min, cool slightly', 5, 0, 1, 0, 'Drink warm. 45 min after Thyrox.', 1),
    (v_diet_w12, 4, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 slice watermelon (medium)', 200, 28, 16, 1, 'No milk.', 2),
    (v_diet_w12, 4, 'chai',        '1 cup ginger chai — max 1 tsp sugar', 40, 1, 8, 1, 'After breakfast only.', 3),
    (v_diet_w12, 4, 'snack1',      'Roasted chana (25g)', 100, 6, 14, 2, 'From trainer snack rotation.', 4),
    (v_diet_w12, 4, 'lunch',       '2 multigrain roti + chole (half cup) + salad + curd (100g)', 450, 20, 52, 12, 'NO RICE. Chole with roti.', 5),
    (v_diet_w12, 4, 'snack2',      'Sprouts chaat (small bowl)', 120, 6, 16, 2, '', 6),
    (v_diet_w12, 4, 'pre_workout', '3-4 dates + 200ml coconut water', 130, 1, 32, 0, '30-40 min before gym.', 7),
    (v_diet_w12, 4, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, 'No milk. No banana.', 8),
    (v_diet_w12, 4, 'dinner',      'Spinach (palak) soup + sauteed vegetables + paneer (100g)', 320, 24, 18, 14, 'Light dinner.', 9),

    -- SATURDAY (5)
    (v_diet_w12, 5, 'detox_water', 'Lemon water — juice of half lemon in 1 glass warm water, no sugar', 5, 0, 1, 0, '45 min after Thyrox.', 1),
    (v_diet_w12, 5, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 pear', 215, 28, 22, 1, 'No milk.', 2),
    (v_diet_w12, 5, 'chai',        '1 cup tulsi chai — max 1 tsp jaggery', 40, 1, 8, 1, 'After breakfast only. Yoga/recovery day.', 3),
    (v_diet_w12, 5, 'snack1',      '1 small banana + 10 groundnuts', 150, 5, 24, 5, '', 4),
    (v_diet_w12, 5, 'lunch',       '2 multigrain roti + dal + sabzi + curd (100g) + salad', 430, 18, 50, 12, 'NO RICE. Lighter lunch on yoga day.', 5),
    (v_diet_w12, 5, 'snack2',      'Roasted makhana (20-25g)', 90, 3, 14, 2, 'From trainer snack rotation. Light — yoga day.', 6),
    (v_diet_w12, 5, 'pre_workout', 'Not applicable — yoga/recovery day', 0, 0, 0, 0, 'Saturday is active recovery. No heavy pre-workout needed.', 7),
    (v_diet_w12, 5, 'post_workout','Not applicable — yoga day', 0, 0, 0, 0, 'Skip shake on yoga day. Not intense enough to need it.', 8),
    (v_diet_w12, 5, 'dinner',      'Tomato soup + paneer (80g) sauté + light salad', 270, 18, 14, 14, 'Lighter dinner — recovery day.', 9),

    -- SUNDAY (6)
    (v_diet_w12, 6, 'detox_water', 'Cucumber + mint + lemon infused water — prepare 4L in large bottle, sip throughout the day', 10, 0, 2, 0, 'Cucumber slices + 4 pudina leaves + lemon slices in 4L water. Prepare night before.', 1),
    (v_diet_w12, 6, 'breakfast',   '1 scoop isolate protein (in 200ml water) + papaya (small bowl)', 210, 28, 20, 1, 'No milk. Rest day breakfast.', 2),
    (v_diet_w12, 6, 'chai',        '1 cup chai — max 1 tsp sugar', 40, 1, 8, 1, 'After breakfast.', 3),
    (v_diet_w12, 6, 'snack1',      'Puffed rice murmura (20-25g)', 80, 2, 18, 0, 'From trainer snack rotation. Light — rest day.', 4),
    (v_diet_w12, 6, 'lunch',       'Daliya (broken wheat) khichdi + dal + curd (100g) + salad', 400, 16, 52, 10, 'NO RICE. Daliya khichdi is the perfect rice substitute — similar texture, high fiber.', 5),
    (v_diet_w12, 6, 'snack2',      'Coconut water', 45, 0, 10, 0, 'Rest day — lighter snacking.', 6),
    (v_diet_w12, 6, 'pre_workout', 'Not applicable — rest day', 0, 0, 0, 0, 'Sunday rest. Leisure walk only.', 7),
    (v_diet_w12, 6, 'post_workout','Not applicable — rest day', 0, 0, 0, 0, '', 8),
    (v_diet_w12, 6, 'dinner',      'Lauki soup + sauteed paneer (80g)', 260, 16, 14, 13, 'Lightest dinner of the week — rest day.', 9);

  ----------------------------------------------------------------------------
  -- DIET PLAN — Week 3-4
  ----------------------------------------------------------------------------
  insert into public.diet_plans
    (user_id, plan_name, week_group, is_active, source, updated_by, plan_updated_at)
  values
    (v_user_id, 'Trainer Plan — Week 3-4 (No Rice)', 'week_3_4', true, 'admin_created', v_user_id, now())
  returning id into v_diet_w34;

  insert into public.diet_plan_items
    (plan_id, day_of_week, meal_slot, food_item, calories, protein_g, carbs_g, fat_g, notes, sort_order)
  values
    -- MONDAY (0)
    (v_diet_w34, 0, 'detox_water', 'Jeera (cumin) water — 1 tsp cumin seeds soaked overnight', 5, 0, 1, 0, '45 min after Thyrox.', 1),
    (v_diet_w34, 0, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 apple', 220, 28, 20, 2, '', 2),
    (v_diet_w34, 0, 'chai',        '1 cup ginger chai — max 1 tsp jaggery', 40, 1, 8, 1, 'After breakfast only.', 3),
    (v_diet_w34, 0, 'snack1',      '20g roasted pumpkin seeds + 1 guava', 120, 6, 14, 5, '', 4),
    (v_diet_w34, 0, 'lunch',       '2 multigrain roti + bhindi dal + cucumber-onion salad + curd (100g)', 420, 18, 48, 12, 'NO RICE.', 5),
    (v_diet_w34, 0, 'snack2',      '1 whole wheat khakhra', 80, 3, 14, 2, 'From trainer snack rotation.', 6),
    (v_diet_w34, 0, 'pre_workout', '3-4 dates + 200ml coconut water', 130, 1, 32, 0, '', 7),
    (v_diet_w34, 0, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, '', 8),
    (v_diet_w34, 0, 'dinner',      'Stir-fried broccoli (well cooked) + paneer sauté (100g)', 300, 22, 14, 16, 'Broccoli MUST be well cooked — goitrogenic when raw.', 9),

    -- TUESDAY (1)
    (v_diet_w34, 1, 'detox_water', 'Saunf (fennel) water — 1 tsp fennel seeds soaked overnight', 5, 0, 1, 0, '', 1),
    (v_diet_w34, 1, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 guava', 210, 28, 18, 2, '', 2),
    (v_diet_w34, 1, 'chai',        '1 cup tulsi chai', 40, 1, 8, 1, '', 3),
    (v_diet_w34, 1, 'snack1',      '100g Greek yogurt + half tsp chia seeds', 110, 10, 8, 4, '', 4),
    (v_diet_w34, 1, 'lunch',       '2 multigrain roti + chole (half cup) + salad + curd (100g)', 440, 20, 52, 10, 'NO RICE. Chole with roti.', 5),
    (v_diet_w34, 1, 'snack2',      'Roasted peanuts (20g)', 110, 5, 4, 9, 'From trainer snack rotation.', 6),
    (v_diet_w34, 1, 'pre_workout', '3-4 dates + warm water', 90, 1, 22, 0, '', 7),
    (v_diet_w34, 1, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, '', 8),
    (v_diet_w34, 1, 'dinner',      'Chana soup + paneer sauté (100g) in olive oil', 315, 26, 18, 14, '', 9),

    -- WEDNESDAY (2)
    (v_diet_w34, 2, 'detox_water', 'Methi water — half tsp fenugreek seeds soaked overnight', 5, 0, 1, 0, 'Chew the seeds. Good for thyroid.', 1),
    (v_diet_w34, 2, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 kiwi', 215, 28, 16, 2, '', 2),
    (v_diet_w34, 2, 'chai',        '1 cup ginger chai', 40, 1, 8, 1, '', 3),
    (v_diet_w34, 2, 'snack1',      '1 small banana + 10 groundnuts', 150, 5, 24, 5, '', 4),
    (v_diet_w34, 2, 'lunch',       '2 methi roti + sabzi + 100g Greek yogurt + salad', 430, 20, 46, 14, 'NO RICE. Methi roti for iron and flavor.', 5),
    (v_diet_w34, 2, 'snack2',      'Roasted makhana (20-25g)', 90, 3, 14, 2, '', 6),
    (v_diet_w34, 2, 'pre_workout', '3-4 dates + 200ml coconut water', 130, 1, 32, 0, '', 7),
    (v_diet_w34, 2, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, '', 8),
    (v_diet_w34, 2, 'dinner',      'Moong dal bowl + 1 multigrain roti', 310, 18, 34, 8, '', 9),

    -- THURSDAY (3)
    (v_diet_w34, 3, 'detox_water', 'Dhaniya water — 1 tsp coriander seeds soaked overnight', 5, 0, 1, 0, '', 1),
    (v_diet_w34, 3, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 orange', 210, 28, 18, 2, '', 2),
    (v_diet_w34, 3, 'chai',        '1 cup tulsi chai', 40, 1, 8, 1, '', 3),
    (v_diet_w34, 3, 'snack1',      '10 almonds + 2 walnut halves', 130, 5, 4, 11, '', 4),
    (v_diet_w34, 3, 'lunch',       '2 multigrain roti + dal + sauteed vegetables + curd (100g)', 420, 18, 48, 12, 'NO RICE.', 5),
    (v_diet_w34, 3, 'snack2',      '2 small besan pancakes (minimal oil)', 130, 8, 14, 5, '', 6),
    (v_diet_w34, 3, 'pre_workout', '3-4 dates + warm water', 90, 1, 22, 0, '', 7),
    (v_diet_w34, 3, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, '', 8),
    (v_diet_w34, 3, 'dinner',      'Clear vegetable soup + grilled paneer (100g)', 310, 22, 16, 15, '', 9),

    -- FRIDAY (4)
    (v_diet_w34, 4, 'detox_water', 'Ginger water — boiled fresh ginger', 5, 0, 1, 0, '', 1),
    (v_diet_w34, 4, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 slice watermelon', 200, 28, 16, 1, '', 2),
    (v_diet_w34, 4, 'chai',        '1 cup ginger chai', 40, 1, 8, 1, '', 3),
    (v_diet_w34, 4, 'snack1',      'Chana chaat (small bowl)', 120, 6, 16, 4, '', 4),
    (v_diet_w34, 4, 'lunch',       'Daliya (broken wheat) pulao with vegetables + dal + curd (100g)', 420, 16, 52, 10, 'NO RICE. Daliya pulao — cook daliya like pulao with spices and veggies. Excellent substitute.', 5),
    (v_diet_w34, 4, 'snack2',      'Roasted chana (25g)', 100, 6, 14, 2, '', 6),
    (v_diet_w34, 4, 'pre_workout', '3-4 dates + 200ml coconut water', 130, 1, 32, 0, '', 7),
    (v_diet_w34, 4, 'post_workout','10 almonds + 1 tsp jaggery + 1 anjeer + 1 scoop isolate protein in water', 350, 30, 22, 14, '', 8),
    (v_diet_w34, 4, 'dinner',      'Spinach soup + sauteed vegetables + paneer (100g)', 320, 24, 18, 14, '', 9),

    -- SATURDAY (5)
    (v_diet_w34, 5, 'detox_water', 'Lemon water — half lemon in warm water', 5, 0, 1, 0, '', 1),
    (v_diet_w34, 5, 'breakfast',   '1 scoop isolate protein (in 200ml water) + 1 pear', 215, 28, 22, 1, '', 2),
    (v_diet_w34, 5, 'chai',        '1 cup tulsi chai', 40, 1, 8, 1, 'Yoga day.', 3),
    (v_diet_w34, 5, 'snack1',      '1 apple + 5 walnuts', 140, 2, 20, 8, '', 4),
    (v_diet_w34, 5, 'lunch',       '2 roti + sabzi + dal + curd (100g)', 420, 16, 50, 12, 'NO RICE. Simple roti-sabzi on recovery day.', 5),
    (v_diet_w34, 5, 'snack2',      'Sprouts chaat (small bowl)', 120, 6, 16, 2, '', 6),
    (v_diet_w34, 5, 'pre_workout', 'Not applicable — yoga day', 0, 0, 0, 0, '', 7),
    (v_diet_w34, 5, 'post_workout','Not applicable — yoga day', 0, 0, 0, 0, '', 8),
    (v_diet_w34, 5, 'dinner',      'Tomato soup + paneer (80g)', 270, 18, 14, 14, 'Lighter — recovery day.', 9),

    -- SUNDAY (6)
    (v_diet_w34, 6, 'detox_water', 'Cucumber + mint + lemon infused water — 4L bottle, sip all day', 10, 0, 2, 0, 'Prepare night before.', 1),
    (v_diet_w34, 6, 'breakfast',   '1 scoop isolate protein (in 200ml water) + papaya (small bowl)', 210, 28, 20, 1, '', 2),
    (v_diet_w34, 6, 'chai',        '1 cup chai', 40, 1, 8, 1, '', 3),
    (v_diet_w34, 6, 'snack1',      'Puffed rice murmura (20-25g)', 80, 2, 18, 0, 'Rest day.', 4),
    (v_diet_w34, 6, 'lunch',       'Daliya khichdi (broken wheat) + dal + curd (100g) + salad', 400, 16, 52, 10, 'NO RICE. Daliya khichdi replaces rice khichdi — same comfort, no rice.', 5),
    (v_diet_w34, 6, 'snack2',      'Coconut water + 15g roasted chana', 90, 4, 16, 1, '', 6),
    (v_diet_w34, 6, 'pre_workout', 'Not applicable — rest day', 0, 0, 0, 0, '', 7),
    (v_diet_w34, 6, 'post_workout','Not applicable — rest day', 0, 0, 0, 0, '', 8),
    (v_diet_w34, 6, 'dinner',      'Daliya upma (broken wheat upma) + dal', 300, 14, 38, 8, 'NO RICE. Daliya upma — savory, light, filling.', 9);

  ----------------------------------------------------------------------------
  -- EXERCISE PLAN — full week
  ----------------------------------------------------------------------------
  insert into public.exercise_plans
    (user_id, plan_name, is_active, updated_by, plan_updated_at)
  values
    (v_user_id, 'Fat Loss + Stamina + Strength Plan', true, v_user_id, now())
  returning id into v_ex_plan;

  insert into public.exercise_plan_items
    (plan_id, day_of_week, exercise_name, category, sets, reps, notes, sort_order)
  values
    -- MONDAY — Lower Body Power
    (v_ex_plan, 0, 'Brisk walk/jog + dynamic leg swings',                     'warmup',   1, '10 min',                  '', 1),
    (v_ex_plan, 0, 'Goblet squats',                                           'main',     4, '15 reps',                 'Focus on depth and controlled movement.', 2),
    (v_ex_plan, 0, 'Walking lunges (dumbbells)',                              'main',     3, '12 each leg',             'Keep torso upright.', 3),
    (v_ex_plan, 0, 'Hip thrusts / glute bridges',                             'main',     4, '15 reps',                 'Squeeze glutes at top. Corrects anterior pelvic tilt.', 4),
    (v_ex_plan, 0, 'Leg press (moderate weight)',                             'main',     3, '15 reps',                 'Push through heels.', 5),
    (v_ex_plan, 0, 'Inner thigh adductor machine',                            'main',     3, '15 reps',                 'Inner thigh target — priority zone.', 6),
    (v_ex_plan, 0, 'HIIT: Jump squats + burpees + mountain climbers',         'hiit',     4, '30 sec on / 15 sec off',  'Maximum calorie burn finisher.', 7),
    (v_ex_plan, 0, 'Cool-down + full stretch',                                'cooldown', 1, '5 min',                   '', 8),

    -- TUESDAY — Cardio + Core
    (v_ex_plan, 1, 'Treadmill incline walk/jog (raise incline every 3 min)',  'main',     1, '25 min',                  'Progressive incline for calorie burn.', 1),
    (v_ex_plan, 1, 'Stationary cycling (moderate-high resistance)',           'main',     1, '10 min',                  '', 2),
    (v_ex_plan, 1, 'Plank hold',                                              'abs',      3, '45 sec',                  'Keep hips level, engage core.', 3),
    (v_ex_plan, 1, 'Bicycle crunches',                                        'abs',      3, '20 reps',                 'Slow and controlled — no neck pulling.', 4),
    (v_ex_plan, 1, 'Russian twists',                                          'abs',      3, '20 reps',                 'Feet off ground for harder version.', 5),
    (v_ex_plan, 1, 'Leg raises',                                              'abs',      3, '15 reps',                 'Lower abs target — key for flat belly.', 6),
    (v_ex_plan, 1, 'Side plank',                                              'abs',      2, '30 sec each side',        'Obliques — waist definition.', 7),
    (v_ex_plan, 1, 'Dead bug',                                                'abs',      3, '10 reps',                 'Core stability exercise.', 8),

    -- WEDNESDAY — Upper Body + HIIT
    (v_ex_plan, 2, 'Arm circles, shoulder rolls, resistance band pull-aparts','warmup',   1, '8 min',                   '', 1),
    (v_ex_plan, 2, 'Dumbbell shoulder press',                                 'main',     3, '12 reps',                 '', 2),
    (v_ex_plan, 2, 'Lateral raises',                                          'main',     3, '12 reps',                 'Light weight, controlled movement.', 3),
    (v_ex_plan, 2, 'Chest press (light dumbbells)',                           'main',     3, '12 reps',                 '', 4),
    (v_ex_plan, 2, 'Seated cable row',                                        'main',     3, '12 reps',                 'Squeeze shoulder blades together.', 5),
    (v_ex_plan, 2, 'Tricep pushdown (cable)',                                 'main',     3, '12 reps',                 '', 6),
    (v_ex_plan, 2, 'Dumbbell bicep curls',                                    'main',     3, '12 reps',                 '', 7),
    (v_ex_plan, 2, 'HIIT: Jumping jacks + push-ups + high knees',             'hiit',     3, '40 sec on / 20 sec off',  '', 8),

    -- THURSDAY — Cardio + Stamina
    (v_ex_plan, 3, 'Running: 5 min easy → 15 min moderate → 5 min push pace', 'main',     1, '25 min total',            'Progressive intensity.', 1),
    (v_ex_plan, 3, 'Stairmaster or incline treadmill walk',                   'main',     1, '15 min',                  'High incline = glute activation + calorie burn.', 2),
    (v_ex_plan, 3, 'Jump rope',                                               'main',     3, '2 min each',              'Great for coordination and cardio.', 3),
    (v_ex_plan, 3, 'Box step-ups (bodyweight)',                               'main',     3, '1 min each',              '', 4),
    (v_ex_plan, 3, 'Cool-down + full body stretch',                           'cooldown', 1, '10 min',                  'Important — prevents soreness.', 5),

    -- FRIDAY — Full Body + Core
    (v_ex_plan, 4, 'Full body dynamic stretch',                               'warmup',   1, '8 min',                   '', 1),
    (v_ex_plan, 4, 'Romanian deadlift (light weight — form focus)',           'main',     3, '12 reps',                 'Hamstrings + glutes. Keep back straight.', 2),
    (v_ex_plan, 4, 'Sumo squats with dumbbells',                              'main',     4, '15 reps',                 'Wide stance — targets inner thighs + glutes.', 3),
    (v_ex_plan, 4, 'Lat pulldown (wide grip)',                                'main',     3, '12 reps',                 '', 4),
    (v_ex_plan, 4, 'Cable chest fly',                                         'main',     3, '12 reps',                 '', 5),
    (v_ex_plan, 4, 'Plank + alternating knee-to-elbow',                       'abs',      3, '10 each side',            '', 6),
    (v_ex_plan, 4, 'Reverse crunches',                                        'abs',      3, '15 reps',                 'Lower belly target.', 7),
    (v_ex_plan, 4, 'V-ups',                                                   'abs',      3, '12 reps',                 'Full core engagement.', 8),

    -- SATURDAY — Yoga / Active Recovery
    (v_ex_plan, 5, 'Surya Namaskar (sun salutations)',                        'main',     5, '~20 min total',           '5 rounds. Full body flow.', 1),
    (v_ex_plan, 5, 'Hip flexor stretch + pigeon pose',                        'main',     1, '60 sec each side',        'Deep stretch — critical for hip flexibility.', 2),
    (v_ex_plan, 5, 'Foam rolling — thighs, glutes, lower back',               'cooldown', 1, '10 min',                  'Recovery tool. Roll slowly on tight spots.', 3),
    (v_ex_plan, 5, 'Anulom Vilom + Kapalbhati breathing',                     'cooldown', 1, '10 min',                  'Breathing exercises — calming, good for thyroid.', 4),

    -- SUNDAY — Rest
    (v_ex_plan, 6, 'Leisure outdoor walk — 3,000 to 5,000 steps target',      'main',     1, '30-45 min',               'Easy pace. Enjoy the walk. No intensity.', 1),
    (v_ex_plan, 6, 'Light stretching',                                        'cooldown', 1, '10 min',                  'Only if muscles feel tight.', 2);

  raise notice 'Seeded Niharika: diet_w12=%, diet_w34=%, exercise=%', v_diet_w12, v_diet_w34, v_ex_plan;
end $body$;

-- ============================================================
-- VERIFY (run separately)
-- ============================================================
-- Expected: 126 diet items (63 × 2 weeks), 43 exercises
--
-- select count(*) as diet_items
--   from public.diet_plan_items dpi
--   join public.diet_plans dp on dp.id = dpi.plan_id
--  where dp.user_id = 'c7d4d6df-ff7e-4939-bdf3-a9c45e48075f';
--
-- select count(*) as exercise_items
--   from public.exercise_plan_items epi
--   join public.exercise_plans ep on ep.id = epi.plan_id
--  where ep.user_id = 'c7d4d6df-ff7e-4939-bdf3-a9c45e48075f';
