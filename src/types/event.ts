// types/event.ts
export type EventType = 'block' | 'vacation' | 'meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: EventType;
  createdAt: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  type: EventType;
}

export interface GoogleCalendarStatus {
  connected: boolean;
  email: string;
  lastSync: string;
}
