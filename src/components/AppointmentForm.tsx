// components/AppointmentForm.tsx
import React, { useState } from 'react';
import { AppointmentFormData, AppointmentType } from '../types/appointment';
import { Button } from './Button';
import { Input } from './Input';

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: initialData?.patientId || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    type: initialData?.type || 'consultation',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Paciente é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Hora é obrigatória';
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
    <form onSubmit={handleSubmit} className="appointment-form">
      <div className="form-group">
        <label htmlFor="patientId">Paciente *</label>
        <Input
          id="patientId"
          type="text"
          placeholder="Buscar paciente..."
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          error={errors.patientId}
          disabled={loading}
        />
        <small className="form-hint">Digite o nome ou ID do paciente</small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Data *</label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Hora *</label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            error={errors.time}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo *</label>
        <select
          id="type"
          className="form-select"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
          disabled={loading}
        >
          <option value="consultation">Consulta</option>
          <option value="return">Retorno</option>
          <option value="exam">Exame</option>
          <option value="procedure">Procedimento</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Observações</label>
        <textarea
          id="notes"
          className="form-textarea"
          placeholder="Observações adicionais..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar' : 'Criar'} Agendamento
        </Button>
      </div>

      <style>{`
        .appointment-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-hint {
          font-size: 12px;
          color: #6b7280;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #9b87f5;
          box-shadow: 0 0 0 3px rgba(155, 135, 245, 0.1);
        }

        .form-select:disabled,
        .form-textarea:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};
