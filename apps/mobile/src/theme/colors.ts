export const colors = {
  primary: '#9B89C4',       // lavendel
  primaryLight: '#EDE9F7',
  primaryDark: '#6B5FA0',

  secondary: '#F4A896',     // perzik
  secondaryLight: '#FEF0ED',

  protein: '#7BB8D4',       // zacht blauw
  carbs: '#F5C88A',         // warm geel
  fat: '#E8A896',           // zacht roze-oranje

  success: '#7BC4A0',
  warning: '#F5C88A',
  error: '#E87A7A',

  text: '#2D2040',
  textSecondary: '#7B6E8F',
  textDisabled: '#B8AECE',

  background: '#F9F7FF',
  surface: '#FFFFFF',
  border: '#E4DFF0',
  divider: '#F0EDF8',

  white: '#FFFFFF',
  black: '#000000',
} as const

export type Colors = typeof colors
