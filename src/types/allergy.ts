// types/allergy.ts
export type AllergySeverity = 'high' | 'moderate' | 'low';

export interface Allergy {
  id: string;
  patientId: string;
  medication: string;
  severity: AllergySeverity;
  reaction: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AllergyFormData {
  medication: string;
  severity: AllergySeverity;
  reaction: string;
}

export interface AllergyConflict {
  hasConflict: boolean;
  conflicts: Allergy[];
}
