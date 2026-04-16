import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { weightApi } from '../../api/weight.api'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing, borderRadius } from '../../theme/spacing'

type Period = 30 | 90

function SimpleLineChart({ data }: { data: { value: number; label: string }[] }) {
  const W = 320
  const H = 180
  const PAD = { top: 16, right: 16, bottom: 32, left: 40 }

  const values = data.map((d) => d.value)
  const min = Math.min(...values) - 0.5
  const max = Math.max(...values) + 0.5

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right)
  const toY = (v: number) => PAD.top + ((max - v) / (max - min)) * (H - PAD.top - PAD.bottom)

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(' ')

  // Show max 6 labels
  const labelStep = Math.ceil(data.length / 6)
  const labelIndices = data.map((_, i) => i).filter((i) => i % labelStep === 0 || i === data.length - 1)

  return (
    <Svg width={W} height={H}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = PAD.top + t * (H - PAD.top - PAD.bottom)
        const val = (max - t * (max - min)).toFixed(1)
        return (
          <React.Fragment key={i}>
            <Line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={colors.border} strokeWidth={1} />
            <SvgText x={PAD.left - 4} y={y + 4} fontSize={10} fill={colors.textSecondary} textAnchor="end">{val}</SvgText>
          </React.Fragment>
        )
      })}
      {/* Line */}
      <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {/* X labels */}
      {labelIndices.map((i) => (
        <SvgText key={i} x={toX(i)} y={H - 4} fontSize={9} fill={colors.textSecondary} textAnchor="middle">
          {data[i].label}
        </SvgText>
      ))}
    </Svg>
  )
}

export function WeightTrackerScreen() {
  const [weight, setWeight] = useState('')
  const [period, setPeriod] = useState<Period>(30)
  const queryClient = useQueryClient()

  const { data: logs, isLoading } = useQuery({
    queryKey: ['weight', period],
    queryFn: () => weightApi.getHistory(period).then((r) => r.data),
    staleTime: 60_000,
  })

  const { mutate: logWeight, isPending } = useMutation({
    mutationFn: (w: number) => weightApi.log(w),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setWeight('')
      Alert.alert('Opgeslagen!', 'Je gewicht is gelogd.')
    },
  })

  function handleLog() {
    const value = parseFloat(weight.replace(',', '.'))
    if (isNaN(value) || value < 20 || value > 500) {
      Alert.alert('Ongeldig gewicht', 'Voer een geldig gewicht in (bv. 74.5)')
      return
    }
    logWeight(value)
  }

  const chartData = (logs ?? []).map((l) => ({
    value: l.weight_kg,
    label: new Date(l.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
  }))

  const latest = logs?.[logs.length - 1]?.weight_kg

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gewicht</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log vandaag</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="74.5"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <Text style={styles.unit}>kg</Text>
            <TouchableOpacity
              style={[styles.logButton, isPending && styles.disabled]}
              onPress={handleLog}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.logButtonText}>Opslaan</Text>
              )}
            </TouchableOpacity>
          </View>
          {latest && <Text style={styles.latest}>Laatste meting: {latest} kg</Text>}
        </View>

        <View style={styles.periodRow}>
          {([30, 90] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p} dagen
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartCard}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : chartData.length < 2 ? (
            <Text style={styles.empty}>Log minimaal 2 metingen om de grafiek te zien</Text>
          ) : (
            <SimpleLineChart data={chartData} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, color: colors.text, padding: spacing.md, paddingBottom: 0 },
  card: { backgroundColor: colors.surface, margin: spacing.md, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...typography.body },
  unit: { ...typography.body, color: colors.textSecondary },
  logButton: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  disabled: { opacity: 0.6 },
  logButtonText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  latest: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  periodRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  periodBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { ...typography.label, color: colors.textSecondary },
  periodTextActive: { color: colors.white },
  chartCard: { backgroundColor: colors.surface, margin: spacing.md, marginTop: 0, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', minHeight: 220, justifyContent: 'center' },
  empty: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
})
