import type { FastifyRequest, FastifyReply } from 'fastify'
import crypto from 'crypto'
import { config } from '../config'

export async function verifyWhatsappSignature(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // In development, skip signature verification for easier local testing
  if (config.NODE_ENV === 'development') return

  const signature = request.headers['x-hub-signature-256']

  if (!signature || typeof signature !== 'string') {
    return reply.status(401).send({ error: 'Missing webhook signature' })
  }

  const rawBody = JSON.stringify(request.body)
  const expectedSignature =
    'sha256=' +
    crypto
      .createHmac('sha256', config.WHATSAPP_APP_SECRET)
      .update(rawBody)
      .digest('hex')

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return reply.status(401).send({ error: 'Invalid webhook signature' })
  }
}
