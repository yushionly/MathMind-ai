import { retrieveRelevantAnchors, saveConceptFormationEvent } from '@/lib/utils/database';

export async function saveFormationEvent(params: {
  studentId: string;
  concept: string;
  stage: 'concrete' | 'pictorial' | 'abstract';
  anchor: string;
  misconception?: string;
  generatedExamples?: string[];
  stageId?: string;
}): Promise<string> {
  return saveConceptFormationEvent(params);
}

export async function retrieveAnchors(studentId: string, newConcept: string): Promise<string[]> {
  return retrieveRelevantAnchors(studentId, newConcept);
}
