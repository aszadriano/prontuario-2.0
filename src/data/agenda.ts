// data/agenda.ts

export interface TimeSlot {
  time: string;
  status: 'livre' | 'ocupado';
  patient?: string;
  note?: string;
}

export const mockTimeSlots: TimeSlot[] = [
  { time: '08:00', status: 'ocupado', patient: 'Maria Silva', note: 'Consulta' },
  { time: '08:30', status: 'livre' },
  { time: '09:00', status: 'ocupado', patient: 'Joao Pedro', note: 'Retorno' },
  { time: '09:30', status: 'livre' },
  { time: '10:00', status: 'livre' },
  { time: '10:30', status: 'ocupado', patient: 'Ana Carolina', note: 'Consulta' },
  { time: '11:00', status: 'livre' },
  { time: '11:30', status: 'livre' },
  { time: '14:00', status: 'livre' },
  { time: '14:30', status: 'ocupado', patient: 'Pedro Santos', note: 'Exame' },
  { time: '15:00', status: 'livre' },
  { time: '15:30', status: 'livre' },
  { time: '16:00', status: 'ocupado', patient: 'Carla Mendes', note: 'Consulta' },
  { time: '16:30', status: 'livre' },
  { time: '17:00', status: 'livre' },
  { time: '17:30', status: 'livre' },
];
