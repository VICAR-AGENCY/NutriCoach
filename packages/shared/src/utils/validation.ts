/**
 * Normalize a phone number to E.164 format without the leading +.
 * Input: +31612345678, 0031612345678, 0612345678 (NL default)
 * Output: 31612345678
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  // Already has country code (31xxx or 32xxx)
  if (digits.startsWith('31') || digits.startsWith('32')) {
    return digits
  }

  // Dutch local number starting with 06
  if (digits.startsWith('06') && digits.length === 10) {
    return '31' + digits.slice(1)
  }

  return digits
}

/**
 * Format a phone number for display: +31 6 12 34 56 78
 */
export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone)
  if (normalized.startsWith('31') && normalized.length === 11) {
    const local = normalized.slice(2)
    return `+31 ${local[0]} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7)}`
  }
  return `+${normalized}`
}

/**
 * Parse a weight string from user input into a number.
 * Handles: "75", "75kg", "75,5", "75.5 kg"
 */
export function parseWeight(input: string): number | null {
  const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.')
  const value = parseFloat(cleaned)
  if (isNaN(value) || value < 20 || value > 500) return null
  return value
}

/**
 * Parse a height string from user input.
 * Handles: "180", "180cm", "1.80", "1m80"
 */
export function parseHeight(input: string): number | null {
  const cleaned = input.toLowerCase().replace(/\s/g, '')

  // Meter format: 1.80 or 1,80
  const meterMatch = cleaned.match(/^1[.,]\d{2}$/)
  if (meterMatch) {
    return Math.round(parseFloat(cleaned.replace(',', '.')) * 100)
  }

  const digits = cleaned.replace(/[^\d]/g, '')
  const value = parseInt(digits, 10)
  if (isNaN(value) || value < 100 || value > 250) return null
  return value
}

/**
 * Parse a time string (HH:MM) from user input.
 * Handles: "8:00", "08:00", "8u", "8 uur"
 */
export function parseTime(input: string): string | null {
  const cleaned = input.toLowerCase().replace(/[uur\s]/g, '')
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?$/)
  if (!match) return null

  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2] ?? '0', 10)

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
