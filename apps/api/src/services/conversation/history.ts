import Redis from 'ioredis'
import type { ClaudeMessage } from '../claude/client'
import { prisma } from '../../config/database'

const MAX_MESSAGES = 20 // 10 exchanges, rolling context for Claude
const TTL_SECONDS = 60 * 60 * 24 // 24 hours

function key(userId: string) {
  return `chat_history:${userId}`
}

export async function getHistory(redis: Redis, userId: string): Promise<ClaudeMessage[]> {
  const raw = await redis.get(key(userId))
  if (!raw) return []
  try {
    return JSON.parse(raw) as ClaudeMessage[]
  } catch {
    return []
  }
}

export async function appendHistory(
  redis: Redis,
  userId: string,
  userMessage: string,
  assistantReply: string,
): Promise<void> {
  const history = await getHistory(redis, userId)

  history.push({ role: 'user', content: userMessage })
  history.push({ role: 'assistant', content: assistantReply })

  const trimmed = history.slice(-MAX_MESSAGES)

  await redis.set(key(userId), JSON.stringify(trimmed), 'EX', TTL_SECONDS)
}

// Permanent persistence in PostgreSQL via the Conversation table

interface StoredMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

async function getOrCreateConversation(userId: string): Promise<string> {
  const existing = await prisma.conversation.findFirst({
    where: { user_id: userId, status: 'ACTIVE' },
    select: { id: true },
    orderBy: { updated_at: 'desc' },
  })
  if (existing) return existing.id

  const created = await prisma.conversation.create({
    data: { user_id: userId, messages: [], status: 'ACTIVE' },
    select: { id: true },
  })
  return created.id
}

export async function persistMessages(
  userId: string,
  userMessage: string,
  assistantReply: string,
): Promise<void> {
  try {
    const conversationId = await getOrCreateConversation(userId)

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { messages: true },
    })

    const existing = (conversation?.messages as StoredMessage[]) ?? []
    const now = new Date().toISOString()

    const updated: StoredMessage[] = [
      ...existing,
      { role: 'user', content: userMessage, timestamp: now },
      { role: 'assistant', content: assistantReply, timestamp: now },
    ]

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { messages: updated as any },
    })
  } catch (err) {
    // Non-fatal: Redis context still works even if DB persist fails
    console.error('Failed to persist conversation to DB:', err)
  }
}

export async function persistSystemMessage(userId: string, content: string): Promise<void> {
  try {
    const conversationId = await getOrCreateConversation(userId)

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { messages: true },
    })

    const existing = (conversation?.messages as StoredMessage[]) ?? []
    const updated: StoredMessage[] = [
      ...existing,
      { role: 'system', content, timestamp: new Date().toISOString() },
    ]

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { messages: updated as any },
    })
  } catch (err) {
    console.error('Failed to persist system message to DB:', err)
  }
}
