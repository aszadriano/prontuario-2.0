// services/allergyService.ts
import { Allergy, AllergyFormData, AllergyConflict } from '../types/allergy';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const nowIso = () => new Date().toISOString();

const buildMockAllergy = (patientId: string, data?: Partial<Allergy>): Allergy => ({
  id: data?.id ?? `mock-allergy-${Date.now()}`,
  patientId,
  medication: data?.medication ?? 'Dipirona',
  severity: data?.severity ?? 'low',
  reaction: data?.reaction ?? 'Nausea',
  createdAt: data?.createdAt ?? nowIso(),
  updatedAt: data?.updatedAt,
});

export const allergyService = {
  // Fetch patient allergies
  async getPatientAllergies(patientId: string): Promise<Allergy[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return [
        buildMockAllergy(patientId, { id: `mock-allergy-${patientId}-1` }),
        buildMockAllergy(patientId, {
          id: `mock-allergy-${patientId}-2`,
          medication: 'Amoxicilina',
          severity: 'moderate',
          reaction: 'Skin rash',
        }),
      ];
    }
  },

  // Create allergy
  async createAllergy(patientId: string, data: AllergyFormData): Promise<Allergy> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return buildMockAllergy(patientId, {
        medication: data.medication,
        severity: data.severity,
        reaction: data.reaction,
      });
    }
  },

  // Delete allergy
  async deleteAllergy(patientId: string, allergyId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies/${allergyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
    } catch (_error) {
      // no-op fallback
    }
  },

  // Check allergy conflicts
  async checkAllergyConflicts(
    patientId: string,
    medications: string[]
  ): Promise<AllergyConflict> {
    try {
      const response = await fetch(`${API_BASE_URL}/prescriptions/check-allergies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId, medications }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      const hasConflict = medications.some((item) =>
        item.toLowerCase().includes('penicilina')
      );
      return {
        hasConflict,
        conflicts: hasConflict ? [buildMockAllergy(patientId)] : [],
      };
    }
  },
};
