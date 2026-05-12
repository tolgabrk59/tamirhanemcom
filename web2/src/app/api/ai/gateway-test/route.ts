import { NextResponse } from 'next/server';
import { generate, stream, MODELS, DEFAULT_MODEL } from '@/lib/ai-gateway';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_AI_GATEWAY_TEST');

export async function POST(req: Request) {
  try {
    const { prompt, model, streaming } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const selectedModel = model || DEFAULT_MODEL;

    // Streaming response
    if (streaming) {
      const result = stream(prompt, selectedModel);
      return result.toTextStreamResponse();
    }

    // Normal response
    const text = await generate(prompt, selectedModel);

    return NextResponse.json({
      success: true,
      model: selectedModel,
      response: text
    });

  } catch (error: any) {
    logger.error({ error }, 'Gateway Test Error');
    return NextResponse.json(
      { error: error.message || 'Gateway request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Vercel AI Gateway Test Endpoint',
    usage: {
      normal: 'POST { "prompt": "your prompt", "model": "openai/gpt-4o-mini" }',
      streaming: 'POST { "prompt": "your prompt", "streaming": true }'
    },
    available_models: MODELS,
    default_model: DEFAULT_MODEL
  });
}
