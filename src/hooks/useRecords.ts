// hooks/useRecords.ts
import { useState, useEffect, useCallback } from 'react';
import { MedicalRecord, RecordFormData } from '../types/record';
import { recordService } from '../services/recordService';

export const useRecords = (patientId: string | null) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await recordService.getPatientRecords(patientId);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar prontuários');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createRecord = async (data: RecordFormData): Promise<void> => {
    if (!patientId) throw new Error('ID do paciente não fornecido');

    setLoading(true);
    setError(null);

    try {
      const newRecord = await recordService.createRecord(patientId, data);
      setRecords((prev) => [newRecord, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar prontuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (recordId: string, patientName: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await recordService.downloadPDF(recordId, patientName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    createRecord,
    downloadPDF,
    refetch: fetchRecords,
  };
};
