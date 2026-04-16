import type { FastifyInstance } from 'fastify'
import type { WhatsAppWebhookPayload } from '@nutricoach/shared'
import { verifyWhatsappSignature } from '../../middleware/verify-whatsapp'
import { processIncomingMessage } from '../../services/whatsapp/handler'
import { config } from '../../config'
import { logger } from '../../lib/logger'

export async function whatsappRoutes(app: FastifyInstance) {
  // GET — Meta webhook verification challenge (called once during setup)
  app.get<{
    Querystring: {
      'hub.mode': string
      'hub.verify_token': string
      'hub.challenge': string
    }
  }>('/whatsapp', async (request, reply) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = request.query

    if (mode === 'subscribe' && token === config.WHATSAPP_VERIFY_TOKEN) {
      logger.info('WhatsApp webhook verified')
      return reply.send(challenge)
    }

    return reply.status(403).send({ error: 'Webhook verification failed' })
  })

  // POST — incoming messages from Meta
  app.post<{ Body: WhatsAppWebhookPayload }>(
    '/whatsapp',
    { preHandler: verifyWhatsappSignature },
    async (request, reply) => {
      // Always respond 200 immediately — Meta will retry if no 200 within 5s
      reply.status(200).send({ status: 'ok' })

      // Process async after replying — do NOT await here
      processIncomingMessage(request.body).catch((err) => {
        logger.error({ err }, 'Async message processing failed')
      })
    },
  )
}
