export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

export interface MealLog {
  id: string
  user_id: string
  timestamp: Date
  description: string
  meal_type: MealType | null
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  raw_ai_response: unknown | null
}

export interface MealLogCreate {
  user_id: string
  description: string
  meal_type?: MealType
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  raw_ai_response?: unknown
}

export interface DailyMacroTotals {
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_count: number
}
