export type GoalType = 'afvallen' | 'gewicht_houden' | 'aankomen' | 'gezonder_eten'
export type ActivityLevel = 'zittend' | 'licht_actief' | 'matig_actief' | 'zeer_actief'
export type DietType = 'omnivoor' | 'vegetarisch' | 'veganistisch' | 'pescatarisch'
export type Tone = 'streng' | 'motiverend' | 'vriendelijk'
export type Gender = 'man' | 'vrouw' | 'anders'

export interface UserProfile {
  name: string
  dob: string // ISO date: YYYY-MM-DD
  gender: Gender
  height_cm: number
  weight_kg: number
  activity_level: ActivityLevel
  diet_type: DietType
  allergies: string[]
  disliked_foods: string[]
  tone: Tone
  checkin_times: {
    breakfast: string // HH:MM
    lunch: string     // HH:MM
    dinner: string    // HH:MM
  }
}

export interface UserGoal {
  type: GoalType
  target_weight_kg: number
  timeline_weeks: number
  pace_kg_per_week: 0.5 | 0.75 | 1.0
}

export interface UserMacros {
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface User {
  id: string
  phone: string
  profile: UserProfile | null
  goal: UserGoal | null
  calorie_budget: number | null
  macros: UserMacros | null
  timezone: string
  onboarding_step: number
  onboarding_complete: boolean
  fcm_token: string | null
  created_at: Date
  updated_at: Date
}
