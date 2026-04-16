import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../config/database'
import { normalizePhone } from '@nutricoach/shared'
import { logger } from '../../lib/logger'
import { sendTextMessage } from '../../services/whatsapp/client'
import { config } from '../../config'

const OTP_STORE = new Map<string, { otp: string; expiresAt: Date }>()

export async function authRoutes(app: FastifyInstance) {
  // DEV ONLY — remove before production
  if (config.NODE_ENV === 'development') {
    app.post<{ Body: { phone: string } }>(
      '/dev-token',
      async (request, reply) => {
        const phone = normalizePhone(request.body.phone)
        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: { phone },
        })
        const token = await reply.jwtSign({ userId: user.id, phone: user.phone })
        return reply.send({ token, user: { id: user.id, phone: user.phone } })
      },
    )
  }

  // POST /auth/request-otp
  app.post<{ Body: { phone: string } }>(
    '/request-otp',
    {
      schema: {
        body: {
          type: 'object',
          required: ['phone'],
          properties: { phone: { type: 'string' } },
        },
      },
    },
    async (request, reply) => {
      const phone = normalizePhone(request.body.phone)
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + config.OTP_EXPIRY_MINUTES * 60 * 1000)

      OTP_STORE.set(phone, { otp, expiresAt })

      await sendTextMessage(phone, `Je NutriCoach verificatiecode is: *${otp}*\n\nDeze code is ${config.OTP_EXPIRY_MINUTES} minuten geldig.`)

      logger.info({ phone }, 'OTP sent')
      return reply.send({ message: 'OTP verstuurd via WhatsApp' })
    },
  )

  // POST /auth/verify-otp
  app.post<{ Body: { phone: string; otp: string } }>(
    '/verify-otp',
    {
      schema: {
        body: {
          type: 'object',
          required: ['phone', 'otp'],
          properties: {
            phone: { type: 'string' },
            otp: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const phone = normalizePhone(request.body.phone)
      const stored = OTP_STORE.get(phone)

      if (!stored || stored.otp !== request.body.otp || stored.expiresAt < new Date()) {
        return reply.status(401).send({ error: 'Ongeldige of verlopen code' })
      }

      OTP_STORE.delete(phone)

      const user = await prisma.user.upsert({
        where: { phone },
        update: {},
        create: { phone },
      })

      const token = await reply.jwtSign({ userId: user.id, phone: user.phone })

      return reply.send({ token, user: { id: user.id, phone: user.phone } })
    },
  )
}
