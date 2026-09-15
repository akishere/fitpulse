import type {
  DietPlanItem,
  ExercisePlanItem,
} from "@/lib/types";

// Seed diet plan for a typical Indian vegetarian week (Mon–Sun, 0-indexed).
// Values are illustrative and match calorie/protein ranges from the PRD sample.
export const SEED_DIET: DietPlanItem[] = [
  // Monday (0)
  { id: "d-0-1", day_of_week: 0, meal_slot: "detox_water", food_item: "Warm water + lemon + soaked methi seeds", calories: 10, protein_g: 0.2, carbs_g: 2, fat_g: 0, sort_order: 0 },
  { id: "d-0-2", day_of_week: 0, meal_slot: "breakfast", food_item: "Vegetable poha with peanuts + moong sprouts", calories: 360, protein_g: 14, carbs_g: 52, fat_g: 10, sort_order: 1 },
  { id: "d-0-3", day_of_week: 0, meal_slot: "snack1", food_item: "1 apple + 8 almonds", calories: 180, protein_g: 4, carbs_g: 25, fat_g: 7, sort_order: 2 },
  { id: "d-0-4", day_of_week: 0, meal_slot: "lunch", food_item: "2 jowar roti + palak paneer + salad", calories: 520, protein_g: 24, carbs_g: 55, fat_g: 20, sort_order: 3 },
  { id: "d-0-5", day_of_week: 0, meal_slot: "chai", food_item: "Green tea + roasted chana", calories: 120, protein_g: 6, carbs_g: 15, fat_g: 3, sort_order: 4 },
  { id: "d-0-6", day_of_week: 0, meal_slot: "snack2", food_item: "Cucumber + hummus", calories: 150, protein_g: 6, carbs_g: 14, fat_g: 8, sort_order: 5 },
  { id: "d-0-7", day_of_week: 0, meal_slot: "dinner", food_item: "Moong dal khichdi + curd + beetroot salad", calories: 430, protein_g: 20, carbs_g: 60, fat_g: 10, sort_order: 6 },
  // Tuesday (1)
  { id: "d-1-1", day_of_week: 1, meal_slot: "detox_water", food_item: "Jeera water", calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0, sort_order: 0 },
  { id: "d-1-2", day_of_week: 1, meal_slot: "breakfast", food_item: "Besan chilla + mint chutney", calories: 340, protein_g: 18, carbs_g: 32, fat_g: 12, sort_order: 1 },
  { id: "d-1-3", day_of_week: 1, meal_slot: "snack1", food_item: "Buttermilk + roasted makhana", calories: 160, protein_g: 5, carbs_g: 22, fat_g: 5, sort_order: 2 },
  { id: "d-1-4", day_of_week: 1, meal_slot: "lunch", food_item: "Brown rice + rajma + kachumber salad", calories: 540, protein_g: 22, carbs_g: 75, fat_g: 12, sort_order: 3 },
  { id: "d-1-5", day_of_week: 1, meal_slot: "chai", food_item: "Masala tea (no sugar) + 2 khakra", calories: 130, protein_g: 4, carbs_g: 20, fat_g: 4, sort_order: 4 },
  { id: "d-1-6", day_of_week: 1, meal_slot: "snack2", food_item: "Boiled egg white / paneer tikka (6 pcs)", calories: 170, protein_g: 20, carbs_g: 4, fat_g: 8, sort_order: 5 },
  { id: "d-1-7", day_of_week: 1, meal_slot: "dinner", food_item: "Vegetable soup + tofu bhurji + 1 roti", calories: 400, protein_g: 24, carbs_g: 32, fat_g: 14, sort_order: 6 },
  // Wednesday (2)
  { id: "d-2-1", day_of_week: 2, meal_slot: "detox_water", food_item: "Cinnamon + tulsi water", calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0, sort_order: 0 },
  { id: "d-2-2", day_of_week: 2, meal_slot: "breakfast", food_item: "Oats upma + peanuts", calories: 350, protein_g: 14, carbs_g: 50, fat_g: 10, sort_order: 1 },
  { id: "d-2-3", day_of_week: 2, meal_slot: "snack1", food_item: "Papaya bowl + chia seeds", calories: 160, protein_g: 4, carbs_g: 30, fat_g: 4, sort_order: 2 },
  { id: "d-2-4", day_of_week: 2, meal_slot: "lunch", food_item: "Bajra roti + baingan bharta + curd", calories: 500, protein_g: 20, carbs_g: 58, fat_g: 18, sort_order: 3 },
  { id: "d-2-5", day_of_week: 2, meal_slot: "pre_workout", food_item: "1 banana + black coffee", calories: 130, protein_g: 2, carbs_g: 28, fat_g: 1, sort_order: 4 },
  { id: "d-2-6", day_of_week: 2, meal_slot: "post_workout", food_item: "Whey / soy protein shake + 1 date", calories: 180, protein_g: 24, carbs_g: 12, fat_g: 3, sort_order: 5 },
  { id: "d-2-7", day_of_week: 2, meal_slot: "dinner", food_item: "Grilled paneer + sauteed veggies", calories: 420, protein_g: 26, carbs_g: 18, fat_g: 22, sort_order: 6 },
  // Thursday (3)
  { id: "d-3-1", day_of_week: 3, meal_slot: "detox_water", food_item: "Warm water + ACV", calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0, sort_order: 0 },
  { id: "d-3-2", day_of_week: 3, meal_slot: "breakfast", food_item: "Moong dal chilla + paneer stuffing", calories: 380, protein_g: 22, carbs_g: 30, fat_g: 14, sort_order: 1 },
  { id: "d-3-3", day_of_week: 3, meal_slot: "snack1", food_item: "Guava + walnuts (4 halves)", calories: 170, protein_g: 4, carbs_g: 22, fat_g: 8, sort_order: 2 },
  { id: "d-3-4", day_of_week: 3, meal_slot: "lunch", food_item: "Quinoa pulao + kadhi + salad", calories: 520, protein_g: 20, carbs_g: 68, fat_g: 14, sort_order: 3 },
  { id: "d-3-5", day_of_week: 3, meal_slot: "chai", food_item: "Ginger tea + 6 almonds", calories: 110, protein_g: 3, carbs_g: 10, fat_g: 6, sort_order: 4 },
  { id: "d-3-6", day_of_week: 3, meal_slot: "snack2", food_item: "Sprouts chaat (moong+chana)", calories: 190, protein_g: 12, carbs_g: 24, fat_g: 4, sort_order: 5 },
  { id: "d-3-7", day_of_week: 3, meal_slot: "dinner", food_item: "Mixed veg curry + jowar roti + curd", calories: 420, protein_g: 18, carbs_g: 50, fat_g: 12, sort_order: 6 },
  // Friday (4)
  { id: "d-4-1", day_of_week: 4, meal_slot: "detox_water", food_item: "Warm water + soaked chia", calories: 30, protein_g: 1, carbs_g: 3, fat_g: 2, sort_order: 0 },
  { id: "d-4-2", day_of_week: 4, meal_slot: "breakfast", food_item: "Vegetable dalia + curd", calories: 360, protein_g: 15, carbs_g: 55, fat_g: 8, sort_order: 1 },
  { id: "d-4-3", day_of_week: 4, meal_slot: "snack1", food_item: "Watermelon bowl + 8 pistachios", calories: 160, protein_g: 4, carbs_g: 26, fat_g: 6, sort_order: 2 },
  { id: "d-4-4", day_of_week: 4, meal_slot: "lunch", food_item: "2 phulka + chana masala + salad", calories: 520, protein_g: 22, carbs_g: 68, fat_g: 12, sort_order: 3 },
  { id: "d-4-5", day_of_week: 4, meal_slot: "chai", food_item: "Green tea + 2 dates", calories: 100, protein_g: 1, carbs_g: 22, fat_g: 1, sort_order: 4 },
  { id: "d-4-6", day_of_week: 4, meal_slot: "snack2", food_item: "Cottage cheese salad", calories: 210, protein_g: 20, carbs_g: 10, fat_g: 10, sort_order: 5 },
  { id: "d-4-7", day_of_week: 4, meal_slot: "dinner", food_item: "Palak soup + tofu tikka + salad", calories: 380, protein_g: 25, carbs_g: 20, fat_g: 18, sort_order: 6 },
  // Saturday (5)
  { id: "d-5-1", day_of_week: 5, meal_slot: "detox_water", food_item: "Cucumber + mint water", calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0, sort_order: 0 },
  { id: "d-5-2", day_of_week: 5, meal_slot: "breakfast", food_item: "Idli + sambhar + coconut chutney", calories: 380, protein_g: 15, carbs_g: 62, fat_g: 8, sort_order: 1 },
  { id: "d-5-3", day_of_week: 5, meal_slot: "snack1", food_item: "Orange + 8 almonds", calories: 170, protein_g: 4, carbs_g: 25, fat_g: 7, sort_order: 2 },
  { id: "d-5-4", day_of_week: 5, meal_slot: "lunch", food_item: "Vegetable biryani (brown rice) + raita", calories: 560, protein_g: 20, carbs_g: 78, fat_g: 14, sort_order: 3 },
  { id: "d-5-5", day_of_week: 5, meal_slot: "chai", food_item: "Elaichi tea + roasted seeds", calories: 130, protein_g: 5, carbs_g: 12, fat_g: 6, sort_order: 4 },
  { id: "d-5-6", day_of_week: 5, meal_slot: "snack2", food_item: "Paneer + veg salad", calories: 220, protein_g: 20, carbs_g: 10, fat_g: 12, sort_order: 5 },
  { id: "d-5-7", day_of_week: 5, meal_slot: "dinner", food_item: "Grilled veggies + mushroom curry + 1 roti", calories: 400, protein_g: 20, carbs_g: 42, fat_g: 14, sort_order: 6 },
  // Sunday (6)
  { id: "d-6-1", day_of_week: 6, meal_slot: "detox_water", food_item: "Warm water + amla juice", calories: 20, protein_g: 0, carbs_g: 4, fat_g: 0, sort_order: 0 },
  { id: "d-6-2", day_of_week: 6, meal_slot: "breakfast", food_item: "Multigrain paratha + curd + pickle", calories: 400, protein_g: 14, carbs_g: 55, fat_g: 14, sort_order: 1 },
  { id: "d-6-3", day_of_week: 6, meal_slot: "snack1", food_item: "Pomegranate + mixed nuts", calories: 180, protein_g: 5, carbs_g: 25, fat_g: 8, sort_order: 2 },
  { id: "d-6-4", day_of_week: 6, meal_slot: "lunch", food_item: "Dal tadka + jeera rice + salad", calories: 520, protein_g: 22, carbs_g: 78, fat_g: 10, sort_order: 3 },
  { id: "d-6-5", day_of_week: 6, meal_slot: "chai", food_item: "Herbal tea + 2 khakra", calories: 120, protein_g: 3, carbs_g: 20, fat_g: 3, sort_order: 4 },
  { id: "d-6-6", day_of_week: 6, meal_slot: "snack2", food_item: "Fruit chaat", calories: 160, protein_g: 3, carbs_g: 34, fat_g: 2, sort_order: 5 },
  { id: "d-6-7", day_of_week: 6, meal_slot: "dinner", food_item: "Mixed veg soup + paneer bhurji roll", calories: 420, protein_g: 25, carbs_g: 34, fat_g: 16, sort_order: 6 },
];

export const SEED_EXERCISE: ExercisePlanItem[] = [
  // Mon — Push
  { id: "e-0-1", day_of_week: 0, exercise_name: "Treadmill warmup", category: "warmup", sets: 1, reps: "8 min", notes: "Zone 2, incline 3", sort_order: 0 },
  { id: "e-0-2", day_of_week: 0, exercise_name: "Dumbbell bench press", category: "main", sets: 4, reps: "10-12", last_weight_kg: 14, sort_order: 1 },
  { id: "e-0-3", day_of_week: 0, exercise_name: "Incline machine press", category: "main", sets: 3, reps: "10", last_weight_kg: 22, sort_order: 2 },
  { id: "e-0-4", day_of_week: 0, exercise_name: "Cable chest fly", category: "main", sets: 3, reps: "12-15", last_weight_kg: 10, sort_order: 3 },
  { id: "e-0-5", day_of_week: 0, exercise_name: "Overhead shoulder press", category: "main", sets: 3, reps: "10", last_weight_kg: 10, sort_order: 4 },
  { id: "e-0-6", day_of_week: 0, exercise_name: "Tricep rope pushdown", category: "main", sets: 3, reps: "12", last_weight_kg: 18, sort_order: 5 },
  { id: "e-0-7", day_of_week: 0, exercise_name: "HIIT: Bike sprints", category: "hiit", sets: 6, reps: "30s on / 30s off", sort_order: 6 },
  { id: "e-0-8", day_of_week: 0, exercise_name: "Plank hold", category: "abs", sets: 3, reps: "45s", sort_order: 7 },

  // Tue — Pull
  { id: "e-1-1", day_of_week: 1, exercise_name: "Rowing machine", category: "warmup", sets: 1, reps: "6 min", sort_order: 0 },
  { id: "e-1-2", day_of_week: 1, exercise_name: "Lat pulldown", category: "main", sets: 4, reps: "10-12", last_weight_kg: 30, sort_order: 1 },
  { id: "e-1-3", day_of_week: 1, exercise_name: "Seated cable row", category: "main", sets: 3, reps: "10", last_weight_kg: 32, sort_order: 2 },
  { id: "e-1-4", day_of_week: 1, exercise_name: "Face pulls", category: "main", sets: 3, reps: "15", last_weight_kg: 14, sort_order: 3 },
  { id: "e-1-5", day_of_week: 1, exercise_name: "Bicep curls (DB)", category: "main", sets: 3, reps: "12", last_weight_kg: 8, sort_order: 4 },
  { id: "e-1-6", day_of_week: 1, exercise_name: "Farmer carry", category: "forearm", sets: 3, reps: "40s", last_weight_kg: 16, sort_order: 5 },
  { id: "e-1-7", day_of_week: 1, exercise_name: "HIIT: Battle ropes", category: "hiit", sets: 5, reps: "30s on / 30s off", sort_order: 6 },

  // Wed — Legs
  { id: "e-2-1", day_of_week: 2, exercise_name: "Bike warmup", category: "warmup", sets: 1, reps: "8 min", sort_order: 0 },
  { id: "e-2-2", day_of_week: 2, exercise_name: "Goblet squat", category: "main", sets: 4, reps: "12", last_weight_kg: 14, sort_order: 1 },
  { id: "e-2-3", day_of_week: 2, exercise_name: "Romanian deadlift", category: "main", sets: 4, reps: "10", last_weight_kg: 20, sort_order: 2 },
  { id: "e-2-4", day_of_week: 2, exercise_name: "Walking lunges", category: "main", sets: 3, reps: "16 steps", sort_order: 3 },
  { id: "e-2-5", day_of_week: 2, exercise_name: "Leg curl machine", category: "main", sets: 3, reps: "12", last_weight_kg: 22, sort_order: 4 },
  { id: "e-2-6", day_of_week: 2, exercise_name: "Standing calf raise", category: "main", sets: 4, reps: "15", last_weight_kg: 18, sort_order: 5 },
  { id: "e-2-7", day_of_week: 2, exercise_name: "HIIT: Assault bike", category: "hiit", sets: 8, reps: "20s on / 40s off", sort_order: 6 },

  // Thu — Cardio + Abs
  { id: "e-3-1", day_of_week: 3, exercise_name: "Skipping rope", category: "warmup", sets: 3, reps: "2 min", sort_order: 0 },
  { id: "e-3-2", day_of_week: 3, exercise_name: "Treadmill run intervals", category: "hiit", sets: 6, reps: "1 min fast / 1 min slow", sort_order: 1 },
  { id: "e-3-3", day_of_week: 3, exercise_name: "Hanging knee raise", category: "abs", sets: 4, reps: "12", sort_order: 2 },
  { id: "e-3-4", day_of_week: 3, exercise_name: "Cable woodchopper", category: "abs", sets: 3, reps: "12/side", last_weight_kg: 10, sort_order: 3 },
  { id: "e-3-5", day_of_week: 3, exercise_name: "Russian twists", category: "abs", sets: 3, reps: "30", last_weight_kg: 5, sort_order: 4 },
  { id: "e-3-6", day_of_week: 3, exercise_name: "Stretch cooldown", category: "cooldown", sets: 1, reps: "8 min", sort_order: 5 },

  // Fri — Full body
  { id: "e-4-1", day_of_week: 4, exercise_name: "Rowing", category: "warmup", sets: 1, reps: "7 min", sort_order: 0 },
  { id: "e-4-2", day_of_week: 4, exercise_name: "Deadlift", category: "main", sets: 4, reps: "6", last_weight_kg: 40, sort_order: 1 },
  { id: "e-4-3", day_of_week: 4, exercise_name: "Push-ups", category: "main", sets: 4, reps: "AMRAP", sort_order: 2 },
  { id: "e-4-4", day_of_week: 4, exercise_name: "Assisted pull-ups", category: "main", sets: 4, reps: "6-8", last_weight_kg: 30, sort_order: 3 },
  { id: "e-4-5", day_of_week: 4, exercise_name: "Kettlebell swings", category: "hiit", sets: 5, reps: "20", last_weight_kg: 12, sort_order: 4 },
  { id: "e-4-6", day_of_week: 4, exercise_name: "Plank", category: "abs", sets: 3, reps: "60s", sort_order: 5 },

  // Sat — Active recovery
  { id: "e-5-1", day_of_week: 5, exercise_name: "Yoga flow", category: "warmup", sets: 1, reps: "20 min", sort_order: 0 },
  { id: "e-5-2", day_of_week: 5, exercise_name: "Brisk walk", category: "main", sets: 1, reps: "40 min", sort_order: 1 },
  { id: "e-5-3", day_of_week: 5, exercise_name: "Mobility drills", category: "cooldown", sets: 1, reps: "10 min", sort_order: 2 },

  // Sun — Rest
];
