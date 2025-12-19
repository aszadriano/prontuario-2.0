// services/appointmentService.ts
import { Appointment, AppointmentFormData, AppointmentStatus } from '../types/appointment';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const buildMockAppointment = (overrides: Partial<Appointment> = {}): Appointment => ({
  id: overrides.id ?? `mock-apt-${Date.now()}`,
  patientId: overrides.patientId ?? '1',
  patientName: overrides.patientName ?? 'Paciente Mock',
  date: overrides.date ?? today(),
  time: overrides.time ?? '09:00',
  type: overrides.type ?? 'consultation',
  status: overrides.status ?? 'scheduled',
  notes: overrides.notes ?? 'Mock appointment',
  createdAt: overrides.createdAt ?? nowIso(),
  updatedAt: overrides.updatedAt,
});

const mockAppointments: Appointment[] = [
  buildMockAppointment({
    id: 'mock-apt-1',
    patientId: '1',
    patientName: 'Maria Silva',
    date: today(),
    time: '09:00',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Follow-up',
  }),
  buildMockAppointment({
    id: 'mock-apt-2',
    patientId: '2',
    patientName: 'Joao Pedro',
    date: today(),
    time: '10:30',
    type: 'return',
    status: 'confirmed',
    notes: 'Routine check',
  }),
];

const filterAppointments = (
  data: Appointment[],
  filters?: { date?: string; status?: string }
) => {
  let result = [...data];
  if (filters?.date) {
    result = result.filter((item) => item.date === filters.date);
  }
  if (filters?.status) {
    result = result.filter((item) => item.status === filters.status);
  }
  return result;
};

export const appointmentService = {
  // Fetch all appointments
  async getAppointments(filters?: { date?: string; status?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);

    try {
      const response = await fetch(`${API_BASE_URL}/appointments?${params.toString()}`, {
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
      return filterAppointments(mockAppointments, filters);
    }
  },

  // Create a new appointment
  async createAppointment(data: AppointmentFormData): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
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
      return buildMockAppointment({
        patientId: data.patientId,
        date: data.date,
        time: data.time,
        type: data.type,
        notes: data.notes,
      });
    }
  },

  // Update an appointment
  async updateAppointment(id: string, data: Partial<AppointmentFormData>): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
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
      return buildMockAppointment({
        id,
        patientId: data.patientId ?? '1',
        date: data.date ?? today(),
        time: data.time ?? '09:00',
        type: data.type ?? 'consultation',
        notes: data.notes ?? 'Mock appointment',
      });
    }
  },

  // Delete an appointment
  async deleteAppointment(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
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

  // Confirm an appointment
  async confirmAppointment(id: string): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return buildMockAppointment({
        id,
        status: 'confirmed' as AppointmentStatus,
      });
    }
  },

  // Mark appointment as completed
  async completeAppointment(id: string): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return buildMockAppointment({
        id,
        status: 'completed' as AppointmentStatus,
      });
    }
  },
};
