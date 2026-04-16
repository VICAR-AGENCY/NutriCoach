import { apiClient } from './client'

export interface WeightEntry {
  id: string
  date: string
  weight_kg: number
}

export const weightApi = {
  getHistory: (days = 30) =>
    apiClient.get<WeightEntry[]>(`/weight?days=${days}`),

  log: (weight_kg: number, date?: string) =>
    apiClient.post<WeightEntry>('/weight', { weight_kg, date }),
}
