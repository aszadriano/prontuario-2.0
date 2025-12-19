// services/eventService.ts
import { CalendarEvent, EventFormData, GoogleCalendarStatus } from '../types/event';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

export const eventService = {
  /**
   * Busca todos os eventos
   */
  async getEvents(): Promise<CalendarEvent[]> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar eventos');
    }

    return response.json();
  },

  /**
   * Cria um novo evento
   */
  async createEvent(data: EventFormData): Promise<CalendarEvent> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar evento');
    }

    return response.json();
  },

  /**
   * Atualiza um evento
   */
  async updateEvent(id: string, data: Partial<EventFormData>): Promise<CalendarEvent> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar evento');
    }

    return response.json();
  },

  /**
   * Remove um evento
   */
  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover evento');
    }
  },
};

export const googleCalendarService = {
  /**
   * Obtém URL de autenticação OAuth
   */
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/google/auth-url`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter URL de autenticação');
    }

    const data = await response.json();
    return data.authUrl;
  },

  /**
   * Callback OAuth (troca code por token)
   */
  async handleCallback(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/google/callback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Erro ao conectar com Google Calendar');
    }
  },

  /**
   * Obtém status da conexão
   */
  async getStatus(): Promise<GoogleCalendarStatus> {
    const response = await fetch(`${API_BASE_URL}/google/status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter status da conexão');
    }

    return response.json();
  },

  /**
   * Sincroniza agendamentos e eventos
   */
  async sync(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/google/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao sincronizar com Google Calendar');
    }
  },

  /**
   * Desconecta Google Calendar
   */
  async disconnect(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/google/disconnect`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao desconectar Google Calendar');
    }
  },
};
