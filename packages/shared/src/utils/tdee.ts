import type { Gender, ActivityLevel, GoalType } from '../types/user'
import type { UserMacros } from '../types/user'
import {
  ACTIVITY_MULTIPLIERS,
  PACE_CALORIE_ADJUSTMENT,
  MACRO_RATIOS,
  KCAL_PER_GRAM,
  MIN_CALORIES,
} from '../constants/macros'

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation.
 * More accurate than Harris-Benedict for modern populations.
 */
export function calculateBMR(params: {
  weight_kg: number
  height_cm: number
  age_years: number
  gender: Gender
}): number {
  const { weight_kg, height_cm, age_years, gender } = params

  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age_years

  if (gender === 'man') return base + 5
  if (gender === 'vrouw') return base - 161
  // 'anders': use average of male and female
  return base - 78
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(params: {
  weight_kg: number
  height_cm: number
  age_years: number
  gender: Gender
  activity_level: ActivityLevel
}): number {
  const bmr = calculateBMR(params)
  const multiplier = ACTIVITY_MULTIPLIERS[params.activity_level]
  return Math.round(bmr * multiplier)
}

/**
 * Calculate the daily calorie budget based on TDEE and weight goal.
 */
export function calculateCalorieBudget(params: {
  weight_kg: number
  height_cm: number
  age_years: number
  gender: Gender
  activity_level: ActivityLevel
  goal_type: GoalType
  pace_kg_per_week?: 0.5 | 0.75 | 1.0
}): number {
  const tdee = calculateTDEE(params)
  const { goal_type, pace_kg_per_week, gender } = params

  let adjustment = 0
  if (goal_type === 'afvallen' && pace_kg_per_week) {
    adjustment = PACE_CALORIE_ADJUSTMENT[String(pace_kg_per_week)] ?? -500
  } else if (goal_type === 'aankomen') {
    adjustment = 300
  }

  const budget = tdee + adjustment
  const minimum = MIN_CALORIES[gender]

  return Math.max(budget, minimum)
}

/**
 * Calculate recommended daily macros from a calorie budget.
 */
export function calculateMacros(calorie_budget: number): UserMacros {
  const protein_kcal = calorie_budget * MACRO_RATIOS.protein
  const carbs_kcal = calorie_budget * MACRO_RATIOS.carbs
  const fat_kcal = calorie_budget * MACRO_RATIOS.fat

  return {
    protein_g: Math.round(protein_kcal / KCAL_PER_GRAM.protein),
    carbs_g: Math.round(carbs_kcal / KCAL_PER_GRAM.carbs),
    fat_g: Math.round(fat_kcal / KCAL_PER_GRAM.fat),
  }
}

/**
 * Calculate age in years from a date of birth string (YYYY-MM-DD).
 */
export function ageFromDob(dob: string): number {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
