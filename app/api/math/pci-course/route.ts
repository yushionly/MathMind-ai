import { NextRequest } from 'next/server';
import { callLLM } from '@/lib/ai/llm';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { resolveModelFromHeaders } from '@/lib/server/resolve-model';
import {
  buildPCIMetaPrompt,
  buildPCISystemPrompt,
  buildPCIUserPrompt,
} from '@/lib/education/pci/prompt-builder';
import { validatePCIContent } from '@/lib/education/pci/meta-validator';
import type { PCICourseRequest } from '@/lib/education/pci/types';

interface RequestBody {
  request: PCICourseRequest;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const request = body.request;

    if (!request?.concept) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'request.concept is required');
    }
    if (!request.language) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'request.language is required');
    }

    const { model } = resolveModelFromHeaders(req);
    const system = buildPCISystemPrompt(request.language);
    const user = buildPCIUserPrompt(request);

    let result = await callLLM({ model, system, prompt: user }, 'pci-course');
    let validation = validatePCIContent(result.text);
    let rewriteCount = 0;

    while (!validation.valid && rewriteCount < 2) {
      const metaPrompt = buildPCIMetaPrompt(request.language, result.text);
      const issueText = validation.issues.map((i) => `${i.code}: ${i.message}`).join('\n');
      const rewrite = await callLLM(
        {
          model,
          system,
          prompt: `${user}\n\n【元验证反馈】\n${issueText}\n\n【重写要求】\n${metaPrompt}`,
        },
        'pci-course-rewrite',
      );

      result = rewrite;
      validation = validatePCIContent(result.text);
      rewriteCount += 1;
    }

    return apiSuccess({
      content: result.text,
      validation,
      rewriteCount,
    });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
  }
}
