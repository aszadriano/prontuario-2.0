// types/appointment.ts
export type AppointmentType = 'consultation' | 'return' | 'exam' | 'procedure';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  type: AppointmentType;
  notes: string;
}
