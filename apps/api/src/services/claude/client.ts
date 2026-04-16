import Anthropic from '@anthropic-ai/sdk'
import { config } from '../../config'
import { logger } from '../../lib/logger'

const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY })

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeCallParams {
  system: string
  messages: ClaudeMessage[]
  maxTokens?: number
}

/**
 * Call the Claude API and return the text response.
 * Uses claude-sonnet-4-6 as the default model.
 */
export async function callClaude(params: ClaudeCallParams): Promise<string> {
  const { system, messages, maxTokens = 1024 } = params

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system,
    messages,
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error(`Unexpected Claude response type: ${content.type}`)
  }

  logger.debug(
    { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
    'Claude API call completed',
  )

  return content.text
}

/**
 * Call Claude expecting a JSON response. Parses and returns the object.
 * Throws if the response is not valid JSON.
 */
export async function callClaudeJSON<T>(params: ClaudeCallParams): Promise<T> {
  const text = await callClaude({ ...params, maxTokens: params.maxTokens ?? 512 })

  // Extract JSON from the response (Claude sometimes adds markdown fences)
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/(\{[\s\S]*\})/)
  const jsonString = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : text

  try {
    return JSON.parse(jsonString) as T
  } catch {
    logger.error({ text }, 'Failed to parse Claude JSON response')
    throw new Error(`Claude returned invalid JSON: ${text.slice(0, 200)}`)
  }
}
