import type { CognitiveConflictResult, ConceptFormationStage } from './types';

export function generateCognitiveConflict(
  concept: string,
  studentLevel: string,
  context: string,
): CognitiveConflictResult {
  return {
    setup: `面向${studentLevel}学生，围绕${context}创建${concept}学习情境：主角必须在时间受限下完成任务。`,
    trap1: '第一次尝试：按直觉均分，发现无法整份表示。',
    trap2: '第二次尝试：换了分法，但依旧出现小数或碎片化步骤。',
    resolutionTrigger: '线索：寻找一个同时对齐两种节奏的共同单位。',
  };
}

export function diagnoseConceptFormation(studentResponse: string): ConceptFormationStage {
  const text = studentResponse.toLowerCase();
  if (/格子|图|画|拖|分成/.test(text)) return 'CONCRETE';
  if (/表格|柱状|线段|比例图|diagram|chart/.test(text)) return 'PICTORIAL';
  if (/公式|符号|最小公倍数|lcm|表达式/.test(text)) return 'ABSTRACT';
  return 'CONCRETE';
}
