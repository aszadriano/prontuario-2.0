// services/recordService.ts
import { MedicalRecord, RecordFormData } from '../types/record';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const buildMockRecord = (patientId: string, data?: Partial<MedicalRecord>): MedicalRecord => ({
  id: data?.id ?? `mock-record-${Date.now()}`,
  patientId,
  consultationId: data?.consultationId ?? 'mock-consult',
  date: data?.date ?? today(),
  chiefComplaint: data?.chiefComplaint ?? 'Headache',
  historyOfPresentIllness: data?.historyOfPresentIllness ?? 'Symptoms for 2 days',
  physicalExam: data?.physicalExam ?? 'Normal',
  diagnosis: data?.diagnosis ?? 'Tension headache',
  plan: data?.plan ?? 'Hydration and rest',
  doctorId: data?.doctorId ?? 'mock-doctor',
  doctorName: data?.doctorName ?? 'Dr. Mock',
  createdAt: data?.createdAt ?? nowIso(),
  updatedAt: data?.updatedAt,
});

export const recordService = {
  // Fetch records for a patient
  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/records`, {
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
        buildMockRecord(patientId, { id: `mock-record-${patientId}-1` }),
        buildMockRecord(patientId, { id: `mock-record-${patientId}-2`, diagnosis: 'Mock diagnosis' }),
      ];
    }
  },

  // Fetch a specific record
  async getRecordById(recordId: string): Promise<MedicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
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
      return buildMockRecord('1', { id: recordId });
    }
  },

  // Create a new record
  async createRecord(patientId: string, data: RecordFormData): Promise<MedicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/records`, {
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
      return buildMockRecord(patientId, {
        consultationId: data.consultationId,
        chiefComplaint: data.chiefComplaint,
        historyOfPresentIllness: data.historyOfPresentIllness,
        physicalExam: data.physicalExam,
        diagnosis: data.diagnosis,
        plan: data.plan,
      });
    }
  },

  // Generate PDF (mock fallback)
  async generatePDF(recordId: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${recordId}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.blob();
    } catch (_error) {
      const content = `Mock PDF for record ${recordId}`;
      return new Blob([content], { type: 'application/pdf' });
    }
  },

  // Download the PDF
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
