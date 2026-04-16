export interface WeightLog {
  id: string
  user_id: string
  date: Date
  weight_kg: number
}

export interface WeightLogCreate {
  user_id: string
  date: Date
  weight_kg: number
}

export interface WeightTrend {
  current_weight_kg: number
  start_weight_kg: number
  target_weight_kg: number
  weekly_change_kg: number
  estimated_goal_date: Date | null
  on_track: 'green' | 'orange' | 'red'
}
