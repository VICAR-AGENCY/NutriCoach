import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing, borderRadius } from '../../theme/spacing'

export function FoodPlanScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Weekplan</Text>
        <View style={styles.card}>
          <Text style={styles.comingSoon}>🥗</Text>
          <Text style={styles.cardTitle}>Je persoonlijk weekplan</Text>
          <Text style={styles.cardBody}>
            Na je onboarding via WhatsApp genereert NutriCoach automatisch een gepersonaliseerd weekmenu op basis van jouw doelen en voorkeuren.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, color: colors.text, padding: spacing.md, paddingBottom: 0 },
  card: { backgroundColor: colors.surface, margin: spacing.md, borderRadius: borderRadius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  comingSoon: { fontSize: 64, marginBottom: spacing.md },
  cardTitle: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
})
