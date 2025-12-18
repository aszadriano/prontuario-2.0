// hooks/useAppointments.ts
import { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentFormData } from '../types/appointment';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = (filters?: { date?: string; status?: string }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await appointmentService.getAppointments(filters);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createAppointment = async (data: AppointmentFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const newAppointment = await appointmentService.createAppointment(data);
      setAppointments((prev) => [newAppointment, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, data: Partial<AppointmentFormData>): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updatedAppointment = await appointmentService.updateAppointment(id, data);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updatedAppointment : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await appointmentService.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const confirmedAppointment = await appointmentService.confirmAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? confirmedAppointment : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const completedAppointment = await appointmentService.completeAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? completedAppointment : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao concluir agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    completeAppointment,
    refetch: fetchAppointments,
  };
};
