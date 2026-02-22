import { logger } from '@/lib/logger';
import { env } from '@/env';

const OPENAI_API_KEY = env.OPENAI_API_KEY;
const OPENAI_MODEL = env.OPENAI_MODEL;

if (!OPENAI_API_KEY) {
  logger.error('❌ OPENAI_API_KEY não encontrada no .env');
  process.exit(1);
}

export async function chamarOpenAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}
