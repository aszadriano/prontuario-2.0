// hooks/useAllergies.ts
import { useState, useEffect, useCallback } from 'react';
import { Allergy, AllergyFormData } from '../types/allergy';
import { allergyService } from '../services/allergyService';

export const useAllergies = (patientId: string | null) => {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllergies = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await allergyService.getPatientAllergies(patientId);
      setAllergies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alergias');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const addAllergy = async (data: AllergyFormData): Promise<void> => {
    if (!patientId) throw new Error('ID do paciente não fornecido');

    setLoading(true);
    setError(null);

    try {
      const newAllergy = await allergyService.createAllergy(patientId, data);
      setAllergies((prev) => [...prev, newAllergy]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar alergia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAllergy = async (allergyId: string): Promise<void> => {
    if (!patientId) throw new Error('ID do paciente não fornecido');

    setLoading(true);
    setError(null);

    try {
      await allergyService.deleteAllergy(patientId, allergyId);
      setAllergies((prev) => prev.filter((a) => a.id !== allergyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover alergia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = async (medications: string[]) => {
    if (!patientId) throw new Error('ID do paciente não fornecido');

    try {
      return await allergyService.checkAllergyConflicts(patientId, medications);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  return {
    allergies,
    loading,
    error,
    addAllergy,
    removeAllergy,
    checkConflicts,
    refetch: fetchAllergies,
  };
};
