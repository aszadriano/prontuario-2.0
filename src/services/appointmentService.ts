// services/appointmentService.ts
import { Appointment, AppointmentFormData } from '../types/appointment';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const appointmentService = {
  /**
   * Busca todos os agendamentos
   */
  async getAppointments(filters?: { date?: string; status?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${API_BASE_URL}/appointments?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos');
    }

    return response.json();
  },

  /**
   * Cria um novo agendamento
   */
  async createAppointment(data: AppointmentFormData): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar agendamento');
    }

    return response.json();
  },

  /**
   * Atualiza um agendamento
   */
  async updateAppointment(id: string, data: Partial<AppointmentFormData>): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar agendamento');
    }

    return response.json();
  },

  /**
   * Cancela um agendamento
   */
  async deleteAppointment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao cancelar agendamento');
    }
  },

  /**
   * Confirma um agendamento
   */
  async confirmAppointment(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao confirmar agendamento');
    }

    return response.json();
  },

  /**
   * Marca agendamento como concluído
   */
  async completeAppointment(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao concluir agendamento');
    }

    return response.json();
  },
};
