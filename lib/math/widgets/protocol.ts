export const MATH_WIDGET_TOKENS = {
  waterPoolExplorer: 'WATER_POOL_EXPLORER',
  desmosExplorer: 'DESMOS_EXPLORER',
  geogebraExplorer: 'GEOGEBRA_EXPLORER',
  wordProblemAnimator: 'WORD_PROBLEM_ANIMATOR',
  shapeDragWidget: 'SHAPE_DRAG_WIDGET',
} as const;

export type MathWidgetToken = (typeof MATH_WIDGET_TOKENS)[keyof typeof MATH_WIDGET_TOKENS];

export type MathWidgetType =
  | 'water-pool-explorer'
  | 'desmos-explorer'
  | 'geogebra-explorer'
  | 'word-problem-animator'
  | 'shape-drag-widget';

export interface WordProblemAnimatorParams {
  distance: number;
  speedA: number;
  speedB: number;
  frameCount?: number;
}

export interface MathWidgetInvocation {
  type: MathWidgetType;
  token: MathWidgetToken;
  params?: Record<string, unknown>;
}

interface ExtractResult {
  cleanText: string;
  invocations: MathWidgetInvocation[];
}

const TOKEN_TO_TYPE: Record<MathWidgetToken, MathWidgetType> = {
  [MATH_WIDGET_TOKENS.waterPoolExplorer]: 'water-pool-explorer',
  [MATH_WIDGET_TOKENS.desmosExplorer]: 'desmos-explorer',
  [MATH_WIDGET_TOKENS.geogebraExplorer]: 'geogebra-explorer',
  [MATH_WIDGET_TOKENS.wordProblemAnimator]: 'word-problem-animator',
  [MATH_WIDGET_TOKENS.shapeDragWidget]: 'shape-drag-widget',
};

function tryParseJsonObject(input: string | undefined): Record<string, unknown> | undefined {
  if (!input) return undefined;
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function buildTokenRegex(token: MathWidgetToken): RegExp {
  // Supports two forms:
  // 1) [TOKEN]
  // 2) [TOKEN {"k":"v"}]
  return new RegExp(`\\[${token}(?:\\s+(\\{[^\\]]*\\}))?\\]`, 'g');
}

export function extractMathWidgetInvocations(text: string): ExtractResult {
  let cleanText = text;
  const invocations: MathWidgetInvocation[] = [];

  const tokens = Object.values(MATH_WIDGET_TOKENS) as MathWidgetToken[];
  for (const token of tokens) {
    const regex = buildTokenRegex(token);
    const matches = [...text.matchAll(regex)];
    if (matches.length === 0) continue;

    for (const match of matches) {
      const params = tryParseJsonObject(match[1]);
      invocations.push({
        type: TOKEN_TO_TYPE[token],
        token,
        ...(params ? { params } : {}),
      });
    }

    cleanText = cleanText.replace(regex, '');
  }

  return {
    cleanText: cleanText.trim(),
    invocations,
  };
}
