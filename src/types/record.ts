// types/record.ts
export interface MedicalRecord {
  id: string;
  patientId: string;
  consultationId: string;
  date: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosis: string;
  plan: string;
  doctorId: string;
  doctorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RecordFormData {
  consultationId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosis: string;
  plan: string;
}
