export function fmtInt(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return Math.round(n).toLocaleString();
}

export function fmt1(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toFixed(1);
}

export function fmtDay(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function greetingFor(d = new Date()) {
  const h = d.getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

const MEAL_LABELS: Record<string, string> = {
  detox_water: "Detox water",
  breakfast: "Breakfast",
  snack1: "Mid-morning snack",
  lunch: "Lunch",
  chai: "Chai time",
  snack2: "Evening snack",
  pre_workout: "Pre-workout",
  post_workout: "Post-workout",
  dinner: "Dinner",
};

export function mealLabel(slot: string) {
  return MEAL_LABELS[slot] ?? slot;
}

const MEAL_ORDER = [
  "detox_water",
  "breakfast",
  "snack1",
  "lunch",
  "chai",
  "snack2",
  "pre_workout",
  "post_workout",
  "dinner",
];
export function mealSortIndex(slot: string) {
  const i = MEAL_ORDER.indexOf(slot);
  return i === -1 ? 999 : i;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function dayShort(i: number) {
  return DAYS[i] ?? "";
}
export function dayIndexToday(d = new Date()) {
  // 0 = Monday
  return (d.getDay() + 6) % 7;
}
