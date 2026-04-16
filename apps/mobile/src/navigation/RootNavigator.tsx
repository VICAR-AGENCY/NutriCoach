import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuthStore } from '../store'
import { TabNavigator } from './TabNavigator'
import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen'

const Stack = createStackNavigator()

export function RootNavigator() {
  const { isAuthenticated, hydrate } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={PhoneLoginScreen} />
      )}
    </Stack.Navigator>
  )
}
