// components/RecordForm.tsx
import React, { useState } from 'react';
import { RecordFormData } from '../types/record';
import { Button } from './Button';

interface RecordFormProps {
  consultationId: string;
  onSubmit: (data: RecordFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  consultationId,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<RecordFormData>({
    consultationId,
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExam: '',
    diagnosis: '',
    plan: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RecordFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RecordFormData, string>> = {};

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = 'Queixa principal é obrigatória';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnóstico é obrigatório';
    }

    if (!formData.plan.trim()) {
      newErrors.plan = 'Conduta é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="record-form">
      <div className="form-group">
        <label htmlFor="chiefComplaint">Queixa Principal *</label>
        <textarea
          id="chiefComplaint"
          className="form-textarea"
          placeholder="Descreva a queixa principal do paciente..."
          value={formData.chiefComplaint}
          onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
          disabled={loading}
          rows={3}
        />
        {errors.chiefComplaint && <span className="error-message">{errors.chiefComplaint}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="historyOfPresentIllness">História da Doença Atual</label>
        <textarea
          id="historyOfPresentIllness"
          className="form-textarea"
          placeholder="Descreva a história da doença atual..."
          value={formData.historyOfPresentIllness}
          onChange={(e) => setFormData({ ...formData, historyOfPresentIllness: e.target.value })}
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="physicalExam">Exame Físico</label>
        <textarea
          id="physicalExam"
          className="form-textarea"
          placeholder="Ex: PA 120/80 mmHg, FC 72 bpm, Tax 36.5°C..."
          value={formData.physicalExam}
          onChange={(e) => setFormData({ ...formData, physicalExam: e.target.value })}
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="diagnosis">Diagnóstico *</label>
        <textarea
          id="diagnosis"
          className="form-textarea"
          placeholder="Descreva o diagnóstico..."
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          disabled={loading}
          rows={3}
        />
        {errors.diagnosis && <span className="error-message">{errors.diagnosis}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="plan">Conduta *</label>
        <textarea
          id="plan"
          className="form-textarea"
          placeholder="Descreva a conduta (prescrição, exames, retorno...)..."
          value={formData.plan}
          onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          disabled={loading}
          rows={4}
        />
        {errors.plan && <span className="error-message">{errors.plan}</span>}
      </div>

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Salvar Prontuário
        </Button>
      </div>

      <style>{`
        .record-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
          resize: vertical;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #9b87f5;
          box-shadow: 0 0 0 3px rgba(155, 135, 245, 0.1);
        }

        .form-textarea:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .error-message {
          font-size: 12px;
          color: #ef4444;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </form>
  );
};
