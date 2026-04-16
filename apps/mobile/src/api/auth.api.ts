import { apiClient } from './client'

export const authApi = {
  requestOtp: (phone: string) =>
    apiClient.post<{ message: string }>('/auth/request-otp', { phone }),

  verifyOtp: (phone: string, otp: string) =>
    apiClient.post<{ token: string; user: { id: string; phone: string } }>(
      '/auth/verify-otp',
      { phone, otp },
    ),

  devToken: (phone: string) =>
    apiClient.post<{ token: string; user: { id: string; phone: string } }>(
      '/auth/dev-token',
      { phone },
    ),
}
