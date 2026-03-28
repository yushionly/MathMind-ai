import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { retrieveAnchors, saveFormationEvent } from '@/lib/education/pci/concept-formation-memory';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      studentId?: string;
      concept?: string;
      event?: {
        stage?: 'concrete' | 'pictorial' | 'abstract';
        anchor?: string;
        misconception?: string;
        generatedExamples?: string[];
      };
      stageId?: string;
    };

    if (!body.studentId || !body.concept || !body.event?.stage || !body.event.anchor) {
      return apiError(
        'MISSING_REQUIRED_FIELD',
        400,
        'studentId, concept, event.stage and event.anchor are required',
      );
    }

    const id = await saveFormationEvent({
      studentId: body.studentId,
      concept: body.concept,
      stage: body.event.stage,
      anchor: body.event.anchor,
      ...(body.event.misconception ? { misconception: body.event.misconception } : {}),
      ...(body.event.generatedExamples ? { generatedExamples: body.event.generatedExamples } : {}),
      ...(body.stageId ? { stageId: body.stageId } : {}),
    });

    return apiSuccess({ id });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const concept = searchParams.get('concept') || '';

    if (!studentId) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'studentId is required');
    }

    const anchors = await retrieveAnchors(studentId, concept);
    return apiSuccess({ anchors });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
  }
}
