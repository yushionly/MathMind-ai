import type { PCIValidationResult } from './types';

const EARLY_TERM_PATTERNS = [/\bLCM\b/i, /最小公倍数/];
const FRACTION_FORMULA_PATTERNS = [/1\s*\/\s*3\s*[-+]\s*1\s*\/\s*4/, /\d+\s*\/\s*\d+\s*[-+]\s*\d+\s*\/\s*\d+/];

export function validatePCIContent(content: string): PCIValidationResult {
  const issues: PCIValidationResult['issues'] = [];

  const firstChunk = content.slice(0, 260);
  if (EARLY_TERM_PATTERNS.some((p) => p.test(firstChunk))) {
    issues.push({
      code: 'EARLY_TERM',
      message: 'Concept term appears too early before concrete exploration.',
    });
  }

  if (FRACTION_FORMULA_PATTERNS.some((p) => p.test(content))) {
    issues.push({
      code: 'DIRECT_FRACTION_FORMULA',
      message: 'Direct symbolic fraction formula appears in heuristic flow.',
    });
  }

  if (!/试错|尝试|trap|wrong attempt|第一次/.test(content)) {
    issues.push({
      code: 'FAKE_TRY_PATH',
      message: 'No clear realistic trial-and-error path found.',
    });
  }

  if (!/视觉|触觉|操作|visual|touch|manipulate|drag|动画|图/.test(content)) {
    issues.push({
      code: 'WEAK_MULTISENSORY',
      message: 'Weak multi-sensory channel support.',
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
