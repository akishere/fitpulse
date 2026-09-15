export const PARSE_PLAN_SYSTEM_PROMPT = `You extract a personal fitness plan from raw text (DOCX/PDF).
Return ONLY JSON in this shape:
{
  "diet": [
    {
      "day_of_week": 0-6,  // 0 = Monday
      "meals": [
        {
          "slot": "detox_water" | "breakfast" | "snack1" | "lunch" | "chai" |
                   "snack2" | "pre_workout" | "post_workout" | "dinner",
          "food": string,
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number
        }
      ]
    }
  ],
  "exercises": [
    {
      "day_of_week": 0-6,
      "focus": string,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": string,
          "category": "warmup" | "main" | "hiit" | "cooldown" | "abs" | "forearm",
          "notes": string
        }
      ]
    }
  ]
}

Rules:
- If a day has no explicit meals or workout, omit that day entry.
- Prefer Indian vegetarian food names as-is (do not translate).
- Estimate calories/macros when the plan does not specify them.`;
