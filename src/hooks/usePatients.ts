// hooks/usePatients.ts
import { useState, useEffect } from 'react';

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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar pacientes');
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar paciente');
      }

      const newPatient = await response.json();
      setPatients((prev) => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
      throw err;
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar paciente');
      }

      const updatedPatient = await response.json();
      setPatients((prev) => prev.map((p) => (p.id === id ? updatedPatient : p)));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente');
      throw err;
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar paciente');
      }

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar paciente');
      throw err;
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
