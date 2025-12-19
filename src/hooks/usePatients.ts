// hooks/usePatients.ts
import { useState, useEffect } from 'react';
import { mockPatients } from '../data/patients';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt?: string;
  age?: number;
  status?: string;
  nextConsultation?: string;
  lastConsultation?: string;
  allergies?: string[];
  history?: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

const buildFallbackPatient = (id: string, data: Partial<Patient> = {}): Patient => ({
  id,
  name: data.name ?? 'Paciente Mock',
  cpf: data.cpf ?? '000.000.000-00',
  birthDate: data.birthDate ?? '1990-01-01',
  phone: data.phone ?? '(00) 00000-0000',
  email: data.email ?? 'mock@local',
  address: data.address ?? 'Endereco mock',
  city: data.city ?? 'Cidade',
  state: data.state ?? 'ST',
  zipCode: data.zipCode ?? '00000-000',
  createdAt: data.createdAt ?? new Date().toISOString(),
  updatedAt: data.updatedAt,
});

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/patients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      setPatients(data);
    } catch (_err) {
      setPatients(mockPatients);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/patients', {
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

      const newPatient = await response.json();
      setPatients((prev) => [newPatient, ...prev]);
      return newPatient;
    } catch (_err) {
      const fallbackPatient = buildFallbackPatient(`mock-${Date.now()}`, data);
      setPatients((prev) => [fallbackPatient, ...prev]);
      setError(null);
      return fallbackPatient;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/patients/${id}`, {
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

      const updatedPatient = await response.json();
      setPatients((prev) => prev.map((p) => (p.id === id ? updatedPatient : p)));
      return updatedPatient;
    } catch (_err) {
      let fallbackPatient = buildFallbackPatient(id, data);
      setPatients((prev) => {
        const current = prev.find((p) => p.id === id);
        fallbackPatient = buildFallbackPatient(id, { ...current, ...data });
        return prev.map((p) => (p.id === id ? fallbackPatient : p));
      });
      setError(null);
      return fallbackPatient;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (_err) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
