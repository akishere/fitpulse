export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese";

export function calcBmi(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function bmiLabel(cat: BmiCategory): string {
  return {
    underweight: "Underweight",
    normal: "Normal",
    overweight: "Overweight",
    obese: "Obese",
  }[cat];
}

export function bmiColor(cat: BmiCategory): string {
  return {
    underweight: "text-accent-amber",
    normal: "text-accent-green",
    overweight: "text-accent-amber",
    obese: "text-accent-red",
  }[cat];
}
