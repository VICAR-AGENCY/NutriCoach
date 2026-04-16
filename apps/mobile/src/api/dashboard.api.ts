import { apiClient } from './client'

export interface DashboardData {
  calorie_budget: number
  kcal_consumed: number
  macros_budget: { protein_g: number; carbs_g: number; fat_g: number }
  macros_consumed: { protein_g: number; carbs_g: number; fat_g: number }
  current_weight_kg: number | null
  target_weight_kg: number | null
  streak_days: number
  today_meals: MealEntry[]
}

export interface MealEntry {
  id: string
  description: string
  meal_type: string | null
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  timestamp: string
}

export const dashboardApi = {
  get: () => apiClient.get<DashboardData>('/dashboard'),
}
