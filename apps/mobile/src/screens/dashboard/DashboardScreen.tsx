import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard.api'
import { CalorieRing } from '../../components/CalorieRing'
import { MacroBars } from '../../components/MacroBar'
import { MealCard } from '../../components/MealCard'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing, borderRadius } from '../../theme/spacing'

export function DashboardScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get().then((r) => r.data),
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    )
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Goedemorgen'
    if (h < 18) return 'Goedemiddag'
    return 'Goedenavond'
  })()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}! 👋</Text>
          <View style={styles.streak}>
            <Text style={styles.streakText}>🔥 {data?.streak_days ?? 0} dagen</Text>
          </View>
        </View>

        {/* Calorie ring */}
        <View style={styles.ringCard}>
          <CalorieRing
            consumed={data?.kcal_consumed ?? 0}
            budget={data?.calorie_budget ?? 2000}
            size={180}
          />
          <View style={styles.ringInfo}>
            <Text style={styles.ringLabel}>Resterend</Text>
            <Text style={styles.ringRemaining}>
              {Math.max((data?.calorie_budget ?? 2000) - (data?.kcal_consumed ?? 0), 0)} kcal
            </Text>
          </View>
        </View>

        {/* Macro bars */}
        {data?.macros_budget && data?.macros_consumed && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Macro's vandaag</Text>
            <MacroBars
              consumed={data.macros_consumed}
              budget={data.macros_budget}
            />
          </View>
        )}

        {/* Weight progress */}
        {data?.current_weight_kg && data?.target_weight_kg && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gewicht</Text>
            <View style={styles.weightRow}>
              <View style={styles.weightItem}>
                <Text style={styles.weightValue}>{data.current_weight_kg} kg</Text>
                <Text style={styles.weightLabel}>Huidig</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.weightItem}>
                <Text style={[styles.weightValue, { color: colors.primary }]}>{data.target_weight_kg} kg</Text>
                <Text style={styles.weightLabel}>Doel</Text>
              </View>
            </View>
          </View>
        )}

        {/* Today's meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vandaag gegeten</Text>
          {data?.today_meals?.length === 0 ? (
            <Text style={styles.empty}>Nog niets gelogd — stuur een WhatsApp bericht! 💬</Text>
          ) : (
            data?.today_meals?.map((meal) => (
              <MealCard key={meal.id} {...meal} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, paddingBottom: 0 },
  greeting: { ...typography.h2, color: colors.text },
  streak: { backgroundColor: colors.secondaryLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  streakText: { ...typography.label, color: colors.secondary, fontWeight: '600' },
  ringCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, margin: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.lg, borderWidth: 1, borderColor: colors.border },
  ringInfo: { flex: 1 },
  ringLabel: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  ringRemaining: { ...typography.h2, color: colors.primary },
  card: { backgroundColor: colors.surface, margin: spacing.md, marginTop: 0, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  weightRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  weightItem: { alignItems: 'center' },
  weightValue: { ...typography.h2, color: colors.text },
  weightLabel: { ...typography.label, color: colors.textSecondary },
  arrow: { ...typography.h2, color: colors.textDisabled },
  section: { padding: spacing.md, paddingTop: 0 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.lg },
})
