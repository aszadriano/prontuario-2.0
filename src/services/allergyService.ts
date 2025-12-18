// services/allergyService.ts
import { Allergy, AllergyFormData, AllergyConflict } from '../types/allergy';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

export const allergyService = {
  /**
   * Busca todas as alergias de um paciente
   */
  async getPatientAllergies(patientId: string): Promise<Allergy[]> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar alergias');
    }

    return response.json();
  },

  /**
   * Adiciona uma nova alergia para um paciente
   */
  async createAllergy(patientId: string, data: AllergyFormData): Promise<Allergy> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar alergia');
    }

    return response.json();
  },

  /**
   * Remove uma alergia
   */
  async deleteAllergy(patientId: string, allergyId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/allergies/${allergyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover alergia');
    }
  },

  /**
   * Verifica se há conflito entre medicamentos e alergias do paciente
   */
  async checkAllergyConflicts(patientId: string, medications: string[]): Promise<AllergyConflict> {
    const response = await fetch(`${API_BASE_URL}/prescriptions/check-allergies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, medications }),
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar conflitos de alergias');
    }

    return response.json();
  },
};
