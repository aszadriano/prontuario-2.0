// types/medication.ts
export interface Medication {
  id: string;
  name: string;
  category: string;
  dosage: string;
  posology: string;
  contraindications: string[];
  interactions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationInteraction {
  medication1: string;
  medication2: string;
  severity: 'high' | 'moderate' | 'low';
  description: string;
}

export interface InteractionCheckResult {
  hasInteraction: boolean;
  interactions: MedicationInteraction[];
}
