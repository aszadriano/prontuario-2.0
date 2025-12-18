// services/medicationService.ts
import { Medication, InteractionCheckResult } from '../types/medication';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const medicationService = {
  /**
   * Busca medicamentos por nome (autocomplete)
   */
  async searchMedications(query: string): Promise<Medication[]> {
    const response = await fetch(`${API_BASE_URL}/medications/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar medicamentos');
    }

    return response.json();
  },

  /**
   * Busca detalhes de um medicamento específico
   */
  async getMedicationById(medicationId: string): Promise<Medication> {
    const response = await fetch(`${API_BASE_URL}/medications/${medicationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes do medicamento');
    }

    return response.json();
  },

  /**
   * Verifica interações entre medicamentos
   */
  async checkInteractions(medicationIds: string[]): Promise<InteractionCheckResult> {
    const response = await fetch(`${API_BASE_URL}/medications/check-interactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ medicationIds }),
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar interações medicamentosas');
    }

    return response.json();
  },
};
