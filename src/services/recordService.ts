// services/recordService.ts
import { MedicalRecord, RecordFormData } from '../types/record';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

export const recordService = {
  /**
   * Busca todos os prontuários de um paciente
   */
  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/records`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar prontuários');
    }

    return response.json();
  },

  /**
   * Busca um prontuário específico
   */
  async getRecordById(recordId: string): Promise<MedicalRecord> {
    const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar prontuário');
    }

    return response.json();
  },

  /**
   * Cria um novo prontuário
   */
  async createRecord(patientId: string, data: RecordFormData): Promise<MedicalRecord> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar prontuário');
    }

    return response.json();
  },

  /**
   * Gera PDF do prontuário
   */
  async generatePDF(recordId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/records/${recordId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar PDF');
    }

    return response.blob();
  },

  /**
   * Download do PDF do prontuário
   */
  async downloadPDF(recordId: string, patientName: string): Promise<void> {
    const blob = await this.generatePDF(recordId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuario-${patientName}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
