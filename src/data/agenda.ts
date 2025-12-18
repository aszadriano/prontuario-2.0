// data/agenda.ts

export interface TimeSlot {
  time: string;
  available: boolean;
  patientName?: string;
  type?: string;
}

export const mockTimeSlots: TimeSlot[] = [
  { time: '08:00', available: false, patientName: 'Maria Silva', type: 'Consulta' },
  { time: '08:30', available: true },
  { time: '09:00', available: false, patientName: 'João Pedro', type: 'Retorno' },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: false, patientName: 'Ana Carolina', type: 'Consulta' },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: false, patientName: 'Pedro Santos', type: 'Exame' },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: false, patientName: 'Carla Mendes', type: 'Consulta' },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
];
