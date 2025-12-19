// data/patients.ts
import { Patient } from '../hooks/usePatients';

export type { Patient };

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    birthDate: '1985-03-15',
    phone: '(11) 98765-4321',
    email: 'maria.silva@email.com',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'João Pedro Oliveira',
    cpf: '987.654.321-00',
    birthDate: '1990-07-22',
    phone: '(11) 91234-5678',
    email: 'joao.oliveira@email.com',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    createdAt: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Ana Carolina Souza',
    cpf: '456.789.123-00',
    birthDate: '1978-11-08',
    phone: '(21) 99876-5432',
    email: 'ana.souza@email.com',
    address: 'Rua Copacabana, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22070-001',
    createdAt: '2024-03-05T09:15:00Z',
  },
];
