import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'
import { typography } from '../theme/typography'
import { spacing } from '../theme/spacing'

interface MacroBarProps {
  label: string
  consumed: number
  budget: number
  unit?: string
  barColor: string
}

function MacroBar({ label, consumed, budget, unit = 'g', barColor }: MacroBarProps) {
  const pct = Math.min((consumed / budget) * 100, 100)

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackContainer}>
        <View style={[styles.track, { backgroundColor: barColor + '30' }]}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
      </View>
      <Text style={styles.values}>
        <Text style={{ color: barColor, fontWeight: '600' }}>{Math.round(consumed)}</Text>
        <Text style={styles.budget}>/{budget}{unit}</Text>
      </Text>
    </View>
  )
}

interface MacroBarsProps {
  consumed: { protein_g: number; carbs_g: number; fat_g: number }
  budget: { protein_g: number; carbs_g: number; fat_g: number }
}

export function MacroBars({ consumed, budget }: MacroBarsProps) {
  return (
    <View style={styles.container}>
      <MacroBar label="Eiwitten" consumed={consumed.protein_g} budget={budget.protein_g} barColor={colors.protein} />
      <MacroBar label="Koolh." consumed={consumed.carbs_g} budget={budget.carbs_g} barColor={colors.carbs} />
      <MacroBar label="Vetten" consumed={consumed.fat_g} budget={budget.fat_g} barColor={colors.fat} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.label, color: colors.textSecondary, width: 56 },
  trackContainer: { flex: 1 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  values: { ...typography.label, width: 64, textAlign: 'right' },
  budget: { color: colors.textDisabled },
})
