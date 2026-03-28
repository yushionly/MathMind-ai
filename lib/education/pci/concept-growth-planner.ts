export interface ConceptGrowthStep {
  title: string;
  type: 'concrete' | 'conflict' | 'exploration' | 'abstraction' | 'transfer';
}

export function createConceptGrowthPlan(): ConceptGrowthStep[] {
  return [
    { title: '情境注入：建立真实需求', type: 'concrete' },
    { title: '困境制造：暴露认知缺口', type: 'conflict' },
    { title: '工具发明期：允许试错探索', type: 'exploration' },
    { title: '概念结晶：命名与形式化', type: 'abstraction' },
    { title: '迁移挑战：新情境验证', type: 'transfer' },
  ];
}

export function canAdvanceStage(stage: 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT'): boolean {
  return stage !== 'CONCRETE';
}

export class ConceptGrowthPlanner {
  async createPlan(): Promise<ConceptGrowthStep[]> {
    return createConceptGrowthPlan();
  }

  async reflectOnStep(stage: 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT'): Promise<boolean> {
    return canAdvanceStage(stage);
  }
}
