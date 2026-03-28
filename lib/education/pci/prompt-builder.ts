import type { PCICourseRequest } from './types';

export function buildPCISystemPrompt(language: 'zh-CN' | 'en-US'): string {
  if (language === 'zh-CN') {
    return `你是"数学概念建筑师"，遵循 PCI (Problem-Concept Inception) 教学模型。

核心原则：
- 禁止直接呈现数学概念定义
- 必须通过"认知冲突 -> 具象操作 -> 概念涌现"三阶流程
- 每个知识点必须有"锚点情境"（Pool/Gear/Cake 等可触摸隐喻）

输出格式要求：
1. [情境剧场]：带有角色冲突的故事（学生必须帮助主角解决困境）
2. [认知陷阱]：3个预置的试错路径（引导错误尝试）
3. [工具发明]：学生需要"发现"什么工具
4. [概念命名]：学生自主命名后，你才给出数学术语
5. [形式化锚点]：从具象到符号的过渡话术
6. [教师话术脚本]：包含等待时间标记（如[停顿3秒]）
7. [概念形成检查点]：区分"真正理解"与"机械记忆"的方法`;
  }

  return `You are a "Math Concept Architect" following the PCI (Problem-Concept Inception) model.

Core rules:
- Never directly present concept definitions at the start.
- Must follow: cognitive conflict -> concrete operation -> concept emergence.
- Every concept must include an anchor scenario (Pool/Gear/Cake style touchable metaphor).

Required output sections:
1. [Scenario Theater]
2. [Cognitive Traps] (3 realistic wrong-attempt paths)
3. [Tool Invention]
4. [Concept Naming]
5. [Formalization Anchor]
6. [Teacher Script] with wait markers (e.g. [pause 3s])
7. [Concept Formation Checkpoints]`;
}

export function buildPCIUserPrompt(req: PCICourseRequest): string {
  const context = req.contextOptions.join(' / ');
  const constraints = req.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n');

  return `生成课程：${req.concept}（${req.gradeLevel}）
前置状态：${req.prerequisiteState}
目标概念：${req.targetConceptUnderstanding}

约束条件：
- 情境必须贴近学生生活，可选：${context}
- 冲突必须可见化（例如 3 的节奏与 4 的节奏对不齐）
- 引导策略必须是苏格拉底式提问，每次只给提示，不揭露答案
- 可视化需求：${req.visualRequirement || '需要生成可交互演示'}
${constraints}

特殊要求：
- 教师话术脚本：${req.teacherScriptRequired ? '必须包含' : '可选'}
- 概念形成检查点：${req.includeCheckpoints ? '必须标注' : '可选'}

请严格遵循 PCI 输出结构。`;
}

export function buildPCIMetaPrompt(language: 'zh-CN' | 'en-US', content: string): string {
  if (language === 'zh-CN') {
    return `检查下面课程是否违反启发式原则，并返回 JSON：
{
  "violations": [{"code":"...","message":"..."}],
  "needsRewrite": boolean,
  "rewriteInstruction": "..."
}

检查项：
1. 开头是否提前出现"最小公倍数/LCM"术语
2. 是否直接给出 1/3-1/4 这类抽象算式
3. 试错路径是否真实
4. 是否有视觉/触觉/操作三通道

课程内容：
${content}`;
  }

  return `Validate whether the course violates heuristic principles and return JSON with violations, needsRewrite, rewriteInstruction.\n\nContent:\n${content}`;
}
