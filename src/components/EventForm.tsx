// components/EventForm.tsx
import React, { useState } from 'react';
import { EventFormData, EventType } from '../types/event';
import { Button } from './Button';
import { Input } from './Input';

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    type: initialData?.type || 'block',
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
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
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <Input
          id="title"
          type="text"
          placeholder="Ex: Almoço, Reunião, Férias..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo *</label>
        <select
          id="type"
          className="form-select"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
          disabled={loading}
        >
          <option value="block">🚫 Bloqueio</option>
          <option value="vacation">🏖️ Férias</option>
          <option value="meeting">👥 Reunião</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Data e Hora de Início *</label>
        <Input
          id="startDate"
          type="datetime-local"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          error={errors.startDate}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">Data e Hora de Fim *</label>
        <Input
          id="endDate"
          type="datetime-local"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          error={errors.endDate}
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </div>

      <style>{`
        .event-form {
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

        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-select:focus {
          outline: none;
          border-color: #9b87f5;
          box-shadow: 0 0 0 3px rgba(155, 135, 245, 0.1);
        }

        .form-select:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </form>
  );
};
