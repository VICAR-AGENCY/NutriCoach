import { z } from 'zod'
import 'dotenv/config'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRY: z.string().default('7d'),
  OTP_EXPIRY_MINUTES: z.coerce.number().default(10),

  WHATSAPP_API_URL: z.string().url().default('https://graph.facebook.com/v19.0'),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1, 'WHATSAPP_PHONE_NUMBER_ID is required'),
  WHATSAPP_ACCESS_TOKEN: z.string().min(1, 'WHATSAPP_ACCESS_TOKEN is required'),
  WHATSAPP_VERIFY_TOKEN: z.string().min(1, 'WHATSAPP_VERIFY_TOKEN is required'),
  WHATSAPP_APP_SECRET: z.string().min(1, 'WHATSAPP_APP_SECRET is required'),

  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-', 'Invalid Anthropic API key format'),

  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  MIXPANEL_TOKEN: z.string().optional(),

  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const config = parsed.data
export type Config = typeof config
