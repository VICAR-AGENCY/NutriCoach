export const colors = {
  primary: '#2D9B4E',       // NutriCoach green
  primaryLight: '#E8F5EE',
  primaryDark: '#1E6E35',

  secondary: '#FF6B35',     // Energy orange (calories)
  secondaryLight: '#FFF0EA',

  protein: '#5B8EE6',       // Blue — protein
  carbs: '#F5C242',         // Yellow — carbs
  fat: '#E87D5A',           // Orange-red — fat

  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',

  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#F3F4F6',

  white: '#FFFFFF',
  black: '#000000',
} as const

export type Colors = typeof colors
