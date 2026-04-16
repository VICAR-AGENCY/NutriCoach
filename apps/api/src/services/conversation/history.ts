import Redis from 'ioredis'
import type { ClaudeMessage } from '../claude/client'

const MAX_MESSAGES = 20 // 10 exchanges
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

  // Keep only the last MAX_MESSAGES messages
  const trimmed = history.slice(-MAX_MESSAGES)

  await redis.set(key(userId), JSON.stringify(trimmed), 'EX', TTL_SECONDS)
}
