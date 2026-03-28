import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import {
  runWordProblemAnimationPython,
  type WordProblemAnimationParams,
} from '@/lib/server/math/python-executor';

export const runtime = 'nodejs';

function clamp(value: number, minValue: number, maxValue: number): number {
  return Math.min(maxValue, Math.max(minValue, value));
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<WordProblemAnimationParams>;
    const mode = body.mode === 'chase' ? 'chase' : body.mode === 'meeting' ? 'meeting' : null;

    if (!mode) {
      return apiError('INVALID_REQUEST', 400, 'Invalid mode. Allowed: meeting, chase');
    }

    const distance = clamp(Number(body.distance ?? 120), 60, 300);
    const speedA = clamp(Number(body.speedA ?? 6), 1, 12);
    const speedB = clamp(Number(body.speedB ?? 4), 1, 12);
    const frameCount = Math.round(clamp(Number(body.frameCount ?? 90), 20, 240));

    if (![distance, speedA, speedB, frameCount].every(Number.isFinite)) {
      return apiError('INVALID_REQUEST', 400, 'Invalid numeric params');
    }

    const result = await runWordProblemAnimationPython({
      mode,
      distance,
      speedA,
      speedB,
      frameCount,
    });

    return apiSuccess({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return apiError('INTERNAL_ERROR', 500, message);
  }
}
