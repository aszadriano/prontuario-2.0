export interface InteractionWarning {
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  medications: string[];
}

export abstract class DrugInteractionChecker {
  abstract check(items: { medicationName: string }[]): Promise<InteractionWarning[]>;
}

export class NoopDrugInteractionChecker implements DrugInteractionChecker {
  async check(): Promise<InteractionWarning[]> { return []; }
}

