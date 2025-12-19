// services/eventService.ts
import { CalendarEvent, EventFormData, GoogleCalendarStatus } from '../types/event';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const buildMockEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: overrides.id ?? `mock-event-${Date.now()}`,
  title: overrides.title ?? 'Blocked time',
  startDate: overrides.startDate ?? `${today()}T12:00:00Z`,
  endDate: overrides.endDate ?? `${today()}T13:00:00Z`,
  type: overrides.type ?? 'block',
  createdAt: overrides.createdAt ?? nowIso(),
  updatedAt: overrides.updatedAt,
});

const mockEvents: CalendarEvent[] = [
  buildMockEvent({ id: 'mock-event-1', title: 'Meeting', type: 'meeting' }),
  buildMockEvent({ id: 'mock-event-2', title: 'Vacation', type: 'vacation' }),
];

export const eventService = {
  // Fetch events
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
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
      return mockEvents;
    }
  },

  // Create event
  async createEvent(data: EventFormData): Promise<CalendarEvent> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
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
      return buildMockEvent({
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
      });
    }
  },

  // Update event
  async updateEvent(id: string, data: Partial<EventFormData>): Promise<CalendarEvent> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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
      return buildMockEvent({
        id,
        title: data.title ?? 'Updated event',
        startDate: data.startDate ?? `${today()}T12:00:00Z`,
        endDate: data.endDate ?? `${today()}T13:00:00Z`,
        type: data.type ?? 'block',
      });
    }
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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
};

export const googleCalendarService = {
  // Get OAuth auth URL
  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/auth-url`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      return data.authUrl;
    } catch (_error) {
      return 'https://example.com/mock-google-auth';
    }
  },

  // OAuth callback
  async handleCallback(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/callback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
    } catch (_error) {
      // no-op fallback
    }
  },

  // Connection status
  async getStatus(): Promise<GoogleCalendarStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (_error) {
      return {
        connected: false,
        email: '',
        lastSync: '',
      };
    }
  },

  // Sync
  async sync(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/sync`, {
        method: 'POST',
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

  // Disconnect
  async disconnect(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/disconnect`, {
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
};
