const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jwt_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('jwt_token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  requestOtp: (phone: string) =>
    request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),

  verifyOtp: (phone: string, otp: string) =>
    request<{ token: string; user: { id: string; phone: string } }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  dashboard: () =>
    request<{
      calorie_budget: number
      kcal_consumed: number
      macros_budget: { protein_g: number; carbs_g: number; fat_g: number }
      macros_consumed: { protein_g: number; carbs_g: number; fat_g: number }
      current_weight_kg: number | null
      target_weight_kg: number | null
      streak_days: number
      today_meals: Array<{
        id: string
        description: string
        kcal: number
        protein_g: number
        carbs_g: number
        fat_g: number
        meal_type: string | null
        timestamp: string
      }>
    }>('/dashboard'),

  weightHistory: (days = 30) =>
    request<Array<{ date: string; weight_kg: number }>>(`/weight?days=${days}`),

  logWeight: (weight_kg: number) =>
    request('/weight', { method: 'POST', body: JSON.stringify({ weight_kg }) }),

  meals: (date: string) =>
    request<Array<{
      id: string
      description: string
      kcal: number
      protein_g: number
      carbs_g: number
      fat_g: number
      meal_type: string | null
      timestamp: string
    }>>(`/meals?date=${date}`),

  me: () =>
    request<{ id: string; phone: string; calorie_budget: number | null; profile: Record<string, unknown> | null }>('/users/me'),
}
