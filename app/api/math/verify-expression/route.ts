import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { verifyMathExpression } from '@/lib/education/pci/math-verify';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { expression?: string; expected?: string };

    if (!body.expression || !body.expected) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'expression and expected are required');
    }

    const result = await verifyMathExpression(body.expression, body.expected);
    return apiSuccess({ result });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
  }
}
