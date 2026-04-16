import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'
import { typography } from '../theme/typography'
import { spacing, borderRadius } from '../theme/spacing'

const MEAL_TYPE_LABEL: Record<string, string> = {
  BREAKFAST: '🌅 Ontbijt',
  LUNCH: '☀️ Lunch',
  DINNER: '🌙 Diner',
  SNACK: '🍎 Snack',
}

interface MealCardProps {
  description: string
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_type: string | null
  timestamp: string
}

export function MealCard({ description, kcal, protein_g, carbs_g, fat_g, meal_type, timestamp }: MealCardProps) {
  const time = new Date(timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  const typeLabel = meal_type ? (MEAL_TYPE_LABEL[meal_type] ?? meal_type) : ''

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{typeLabel}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      <View style={styles.macros}>
        <Text style={styles.kcal}>{kcal} kcal</Text>
        <Text style={styles.macro}>E {Math.round(protein_g)}g</Text>
        <Text style={styles.macro}>K {Math.round(carbs_g)}g</Text>
        <Text style={styles.macro}>V {Math.round(fat_g)}g</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  type: { ...typography.label, color: colors.textSecondary },
  time: { ...typography.label, color: colors.textDisabled },
  description: { ...typography.bodySmall, color: colors.text, marginBottom: spacing.sm },
  macros: { flexDirection: 'row', gap: spacing.md },
  kcal: { ...typography.label, color: colors.primary, fontWeight: '600' },
  macro: { ...typography.label, color: colors.textSecondary },
})
