import { callLLM } from '@/lib/ai/llm';
import type { LanguageModel } from 'ai';
import { createConceptGrowthPlan, canAdvanceStage, ConceptGrowthPlanner } from './concept-growth-planner';
import { buildPCISystemPrompt, buildPCIUserPrompt } from './prompt-builder';
import { diagnoseConceptFormation, generateCognitiveConflict } from './math-heuristic-tools';
import type { PCICourseRequest } from './types';

export interface ConceptGrowthFlowDeps {
  model: LanguageModel;
  getAnchors?: (concept: string) => Promise<string[]>;
}

export async function executeConceptGrowthFlow(
  req: PCICourseRequest,
  deps: ConceptGrowthFlowDeps,
): Promise<{ plan: ReturnType<typeof createConceptGrowthPlan>; content: string }> {
  const plan = createConceptGrowthPlan();
  const anchors = deps.getAnchors ? await deps.getAnchors(req.concept) : [];

  // Scenario seed (tool-like deterministic scaffold)
  const conflict = generateCognitiveConflict(req.concept, req.gradeLevel, req.contextOptions[0] || 'pool');

  const system = buildPCISystemPrompt(req.language);
  const user = `${buildPCIUserPrompt(req)}\n\n已知锚点经验：${anchors.join('、') || '暂无'}\n冲突草案：${JSON.stringify(conflict)}`;

  const llmResult = await callLLM({ model: deps.model, system, prompt: user }, 'pci-concept-growth');

  const stage = diagnoseConceptFormation(llmResult.text);
  if (!canAdvanceStage(stage === 'ABSTRACT' ? 'ABSTRACT' : stage === 'PICTORIAL' ? 'PICTORIAL' : 'CONCRETE')) {
    // Keep plan unchanged, caller may ask for another concrete round.
  }

  return { plan, content: llmResult.text };
}

export class ConceptGrowthFlow {
  constructor(private readonly deps: ConceptGrowthFlowDeps) {}

  async execute(req: PCICourseRequest): Promise<{ plan: ReturnType<typeof createConceptGrowthPlan>; content: string }> {
    const planner = new ConceptGrowthPlanner();
    const plan = await planner.createPlan();

    const anchors = this.deps.getAnchors ? await this.deps.getAnchors(req.concept) : [];
    const conflict = generateCognitiveConflict(
      req.concept,
      req.gradeLevel,
      req.contextOptions[0] || 'pool',
    );

    const system = buildPCISystemPrompt(req.language);
    const user = `${buildPCIUserPrompt(req)}\n\n已知锚点经验：${anchors.join('、') || '暂无'}\n冲突草案：${JSON.stringify(conflict)}`;

    const llmResult = await callLLM(
      {
        model: this.deps.model,
        system,
        prompt: user,
      },
      'pci-concept-growth-flow',
    );

    const stage = diagnoseConceptFormation(llmResult.text);
    await planner.reflectOnStep(
      stage === 'ABSTRACT' ? 'ABSTRACT' : stage === 'PICTORIAL' ? 'PICTORIAL' : 'CONCRETE',
    );

    return { plan, content: llmResult.text };
  }
}
