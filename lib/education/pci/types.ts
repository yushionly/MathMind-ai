export type ConceptFormationStage = 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT' | 'READY_FOR_ABSTRACTION';

export interface PCICourseRequest {
  concept: string;
  gradeLevel: string;
  prerequisiteState: string;
  targetConceptUnderstanding: string;
  contextOptions: string[];
  constraints: string[];
  visualRequirement?: string;
  teacherScriptRequired?: boolean;
  includeCheckpoints?: boolean;
  language: 'zh-CN' | 'en-US';
}

export interface PCIValidationIssue {
  code: 'EARLY_TERM' | 'DIRECT_FRACTION_FORMULA' | 'FAKE_TRY_PATH' | 'WEAK_MULTISENSORY';
  message: string;
}

export interface PCIValidationResult {
  valid: boolean;
  issues: PCIValidationIssue[];
}

export interface PCIGenerationResult {
  content: string;
  validation: PCIValidationResult;
  rewriteCount: number;
}

export interface CognitiveConflictResult {
  setup: string;
  trap1: string;
  trap2: string;
  resolutionTrigger: string;
}

export interface ConceptFormationEvent {
  stage: 'concrete' | 'pictorial' | 'abstract';
  anchor: string;
  misconception?: string | null;
  generatedExamples?: string[];
}
