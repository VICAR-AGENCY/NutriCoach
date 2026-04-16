import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing } from '../../theme/spacing'

export function PhoneLoginScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const { requestOtp, verifyOtp, isLoading } = useAuthStore()

  async function handleRequestOtp() {
    if (!phone.trim()) return
    try {
      await requestOtp(phone.trim())
      setStep('otp')
    } catch {
      Alert.alert('Fout', 'Kon de code niet versturen. Controleer je nummer en probeer opnieuw.')
    }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) return
    try {
      await verifyOtp(phone.trim(), otp.trim())
    } catch {
      Alert.alert('Fout', 'Ongeldige of verlopen code. Probeer opnieuw.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <Text style={styles.logo}>🥦</Text>
        <Text style={styles.title}>NutriCoach</Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'Voer je telefoonnummer in'
            : `Code verstuurd naar ${phone} via WhatsApp`}
        </Text>

        {step === 'phone' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="+31 6 12 34 56 78"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleRequestOtp}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRequestOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Code ontvangen via WhatsApp</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="123456"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleVerifyOtp}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Inloggen</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={styles.link}>Verkeerd nummer? Terug</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: spacing.sm },
  title: { ...typography.h1, textAlign: 'center', color: colors.primary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, textAlign: 'center', color: colors.textSecondary, marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...typography.body, color: colors.white, fontWeight: '600' },
  link: { ...typography.bodySmall, color: colors.primary, textAlign: 'center' },
})
