import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../theme/colors'
import { typography } from '../theme/typography'

interface CalorieRingProps {
  consumed: number
  budget: number
  size?: number
  strokeWidth?: number
}

export function CalorieRing({ consumed, budget, size = 160, strokeWidth = 16 }: CalorieRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(consumed / budget, 1)
  const strokeDashoffset = circumference * (1 - progress)

  const isOver = consumed > budget
  const ringColor = isOver ? colors.error : progress > 0.9 ? colors.warning : colors.primary

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primaryLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.consumed, { color: ringColor }]}>{consumed}</Text>
        <Text style={styles.label}>kcal gegeten</Text>
        <Text style={styles.budget}>van {budget}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  svg: { position: 'absolute' },
  center: { alignItems: 'center' },
  consumed: { ...typography.numberSmall },
  label: { ...typography.label, color: colors.textSecondary, marginTop: 2 },
  budget: { ...typography.caption, color: colors.textDisabled },
})
