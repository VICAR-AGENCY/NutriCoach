import type { MealType } from './meal-log'

export interface PlannedMeal {
  day: number // 1 = Monday, 7 = Sunday (ISO weekday)
  meal_type: MealType
  name: string
  ingredients: string[]
  instructions: string
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface FoodPlan {
  id: string
  user_id: string
  week_nr: number // ISO week number
  year: number
  meals: PlannedMeal[]
  created_at: Date
}
