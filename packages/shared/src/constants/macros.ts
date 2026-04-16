import type { ActivityLevel, GoalType } from '../types/user'

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  zittend: 1.2,
  licht_actief: 1.375,
  matig_actief: 1.55,
  zeer_actief: 1.725,
}

export const GOAL_CALORIE_ADJUSTMENT: Record<GoalType, number> = {
  afvallen: -500,       // ~0.5 kg/week deficit
  gewicht_houden: 0,
  aankomen: 300,
  gezonder_eten: 0,
}

export const PACE_CALORIE_ADJUSTMENT: Record<string, number> = {
  '0.5': -385,  // 0.5 kg/week
  '0.75': -578, // 0.75 kg/week
  '1.0': -770,  // 1 kg/week
}

// Macro ratios (% of total calories)
export const MACRO_RATIOS = {
  protein: 0.30,  // 30% of calories from protein
  carbs: 0.40,    // 40% from carbs
  fat: 0.30,      // 30% from fat
}

// Calories per gram
export const KCAL_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
}

export const MIN_CALORIES = {
  man: 1500,
  vrouw: 1200,
  anders: 1200,
}
