import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'
import { FoodDiaryScreen } from '../screens/diary/FoodDiaryScreen'
import { WeightTrackerScreen } from '../screens/weight/WeightTrackerScreen'
import { FoodPlanScreen } from '../screens/plan/FoodPlanScreen'
import { colors } from '../theme/colors'

const Tab = createBottomTabNavigator()

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
)

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={FoodDiaryScreen}
        options={{
          tabBarLabel: 'Dagboek',
          tabBarIcon: ({ focused }) => <TabIcon label="📖" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Weight"
        component={WeightTrackerScreen}
        options={{
          tabBarLabel: 'Gewicht',
          tabBarIcon: ({ focused }) => <TabIcon label="⚖️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Plan"
        component={FoodPlanScreen}
        options={{
          tabBarLabel: 'Weekplan',
          tabBarIcon: ({ focused }) => <TabIcon label="🥗" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}
