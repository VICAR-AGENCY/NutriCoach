import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token from secure store on every request
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401: clear token and let the app redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('jwt_token')
      // Navigation is handled by the auth store
    }
    return Promise.reject(error)
  },
)
