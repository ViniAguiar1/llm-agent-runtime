import Fastify from 'fastify';
import { z } from 'zod';
import { logger } from './lib/logger';
import { chamarOpenAI } from '@/services/openai';
import { env } from './env';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
});

const RequestSchema = z.object({
  mode: z.enum(['chat', 'refactor', 'autocomplete']).default('chat'),
  message: z.string().min(1),
  context: z
    .object({
      arquivoAtual: z.string().optional(),
      selecao: z.string().optional(),
      caminhoProjeto: z.string().optional(),
      erros: z.array(z.string()).optional()
    })
    .optional()
});

type RequestBody = z.infer<typeof RequestSchema>;

app.post('/run', async (request, reply) => {
  const parsed = RequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Payload inválido',
      details: parsed.error.flatten()
    });
  }

  const { message, context } = parsed.data as RequestBody;

  const contextoFormatado = [
    context?.arquivoAtual
      ? `ARQUIVO_ATUAL:\n${context.arquivoAtual}`
      : '',
    context?.selecao
      ? `SELECAO:\n${context.selecao}`
      : '',
    context?.erros && context.erros.length > 0
      ? `ERROS:\n- ${context.erros.join('\n- ')}`
      : ''
  ]
    .filter(Boolean)
    .join('\n\n');

  const prompt = `
${contextoFormatado}

PEDIDO:
${message}

Responda de forma objetiva. Se envolver código, retorne o código completo quando necessário.
`;

  try {
    const result = await chamarOpenAI([
      {
        role: 'system',
        content: 'Você é um assistente de código técnico e objetivo.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    return reply.send({
      provider: 'openai',
      model: env.OPENAI_MODEL,
      text: result
    });
  } catch (error: any) {
    request.log.error(error);

    return reply.status(500).send({
      error: 'Falha ao chamar OpenAI',
      message: error.message
    });
  }
});

app.get('/health', async () => {
  return { status: 'ok' };
});

app.listen({ port: env.PORT, host: '127.0.0.1' })
  .then(() => {
    logger.info('Servidor Iniciado')
    console.log(`🚀 Agent rodando em http://127.0.0.1:${env.PORT}`);
  })
  .catch((err) => {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  });
