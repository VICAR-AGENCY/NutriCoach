import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authApi } from '../api/auth.api'

interface AuthState {
  token: string | null
  userId: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean

  requestOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  hydrate: async () => {
    // DEV: auto-login with a test phone number so the dashboard shows real data
    if (__DEV__) {
      try {
        const { data } = await authApi.devToken('+32468299381')
        await SecureStore.setItemAsync('jwt_token', data.token)
        await SecureStore.setItemAsync('user_id', data.user.id)
        set({ token: data.token, userId: data.user.id, isAuthenticated: true })
        return
      } catch {
        // fall through to stored token
      }
    }
    const token = await SecureStore.getItemAsync('jwt_token')
    const userId = await SecureStore.getItemAsync('user_id')
    if (token && userId) {
      set({ token, userId, isAuthenticated: true })
    }
  },

  requestOtp: async (phone) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.requestOtp(phone)
    } catch (err) {
      set({ error: 'Kon de code niet versturen. Probeer opnieuw.' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authApi.verifyOtp(phone, otp)
      await SecureStore.setItemAsync('jwt_token', data.token)
      await SecureStore.setItemAsync('user_id', data.user.id)
      set({ token: data.token, userId: data.user.id, isAuthenticated: true })
    } catch (err) {
      set({ error: 'Ongeldige code. Probeer opnieuw.' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('jwt_token')
    await SecureStore.deleteItemAsync('user_id')
    set({ token: null, userId: null, isAuthenticated: false })
  },
}))
