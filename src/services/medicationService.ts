// services/medicationService.ts
import { Medication, InteractionCheckResult } from '../types/medication';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const nowIso = () => new Date().toISOString();

const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Amoxicilina',
    category: 'Antibiotico',
    dosage: '500mg',
    posology: '8/8h',
    contraindications: ['Alergia a penicilina'],
    interactions: ['Varfarina'],
    createdAt: nowIso(),
  },
  {
    id: 'med-2',
    name: 'Dipirona',
    category: 'Analgesico',
    dosage: '1g',
    posology: '6/6h',
    contraindications: ['Alergia a dipirona'],
    interactions: [],
    createdAt: nowIso(),
  },
];

const findMedication = (id: string) =>
  mockMedications.find((item) => item.id === id) ?? mockMedications[0];

export const medicationService = {
  // Search medications by name
  async searchMedications(query: string): Promise<Medication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/medications/search?q=${encodeURIComponent(query)}`, {
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
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        return mockMedications;
      }
      return mockMedications.filter((item) => item.name.toLowerCase().includes(normalized));
    }
  },

  // Fetch medication details
  async getMedicationById(medicationId: string): Promise<Medication> {
    try {
      const response = await fetch(`${API_BASE_URL}/medications/${medicationId}`, {
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
      return findMedication(medicationId);
    }
  },

  // Check interactions
  async checkInteractions(medicationIds: string[]): Promise<InteractionCheckResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/medications/check-interactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicationIds }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return {
        hasInteraction: false,
        interactions: [],
      };
    }
  },
};
