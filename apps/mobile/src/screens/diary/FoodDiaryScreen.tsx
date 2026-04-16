import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import { MealCard } from '../../components/MealCard'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing, borderRadius } from '../../theme/spacing'
import type { MealEntry } from '../../api/dashboard.api'

export function FoodDiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dateStr = selectedDate.toISOString().split('T')[0]

  const { data: meals, isLoading } = useQuery({
    queryKey: ['meals', dateStr],
    queryFn: () => apiClient.get<MealEntry[]>(`/meals?date=${dateStr}`).then((r) => r.data),
    staleTime: 60_000,
  })

  function navigateDay(offset: number) {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset)
    setSelectedDate(d)
  }

  const isToday = dateStr === new Date().toISOString().split('T')[0]
  const displayDate = selectedDate.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const totalKcal = (meals ?? []).reduce((sum, m) => sum + m.kcal, 0)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateDay(-1)} style={styles.navBtn}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.dateBlock}>
          <Text style={styles.dateText}>{displayDate}</Text>
          {isToday && <Text style={styles.todayBadge}>Vandaag</Text>}
        </View>
        <TouchableOpacity onPress={() => navigateDay(1)} style={styles.navBtn} disabled={isToday}>
          <Text style={[styles.navText, isToday && { opacity: 0.3 }]}>›</Text>
        </TouchableOpacity>
      </View>

      {totalKcal > 0 && (
        <View style={styles.totalBar}>
          <Text style={styles.totalText}>Totaal: {totalKcal} kcal</Text>
        </View>
      )}

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : meals?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>Nog niets gelogd</Text>
            <Text style={styles.emptySubtitle}>
              Stuur een WhatsApp bericht naar NutriCoach om je maaltijd te loggen
            </Text>
          </View>
        ) : (
          meals?.map((meal) => <MealCard key={meal.id} {...meal} />)
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  navBtn: { padding: spacing.sm },
  navText: { fontSize: 28, color: colors.primary },
  dateBlock: { flex: 1, alignItems: 'center' },
  dateText: { ...typography.h3, color: colors.text, textTransform: 'capitalize' },
  todayBadge: { ...typography.label, color: colors.primary, backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, marginTop: 2 },
  totalBar: { backgroundColor: colors.primaryLight, padding: spacing.sm, paddingHorizontal: spacing.md },
  totalText: { ...typography.label, color: colors.primary, fontWeight: '600' },
  list: { flex: 1, padding: spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl },
})
