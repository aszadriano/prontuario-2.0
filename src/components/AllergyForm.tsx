// components/AllergyForm.tsx
import React, { useState } from 'react';
import { AllergyFormData, AllergySeverity } from '../types/allergy';
import { Button } from './Button';
import { Input } from './Input';

interface AllergyFormProps {
  onSubmit: (data: AllergyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AllergyForm: React.FC<AllergyFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState<AllergyFormData>({
    medication: '',
    severity: 'moderate',
    reaction: '',
  });

  const [errors, setErrors] = useState<Partial<AllergyFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<AllergyFormData> = {};

    if (!formData.medication.trim()) {
      newErrors.medication = 'Medicamento é obrigatório';
    }

    if (!formData.reaction.trim()) {
      newErrors.reaction = 'Reação é obrigatória';
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
    <form onSubmit={handleSubmit} className="allergy-form">
      <div className="form-group">
        <label htmlFor="medication">Medicamento *</label>
        <Input
          id="medication"
          type="text"
          placeholder="Ex: Dipirona, Penicilina..."
          value={formData.medication}
          onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
          error={errors.medication}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="severity">Severidade *</label>
        <select
          id="severity"
          className="form-select"
          value={formData.severity}
          onChange={(e) => setFormData({ ...formData, severity: e.target.value as AllergySeverity })}
          disabled={loading}
        >
          <option value="low">🟢 Baixa</option>
          <option value="moderate">🟡 Moderada</option>
          <option value="high">🔴 Alta</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="reaction">Reação *</label>
        <textarea
          id="reaction"
          className="form-textarea"
          placeholder="Descreva a reação alérgica (ex: urticária, edema, náusea...)"
          value={formData.reaction}
          onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
          disabled={loading}
          rows={3}
        />
        {errors.reaction && <span className="error-message">{errors.reaction}</span>}
      </div>

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Adicionar Alergia
        </Button>
      </div>

      <style>{`
        .allergy-form {
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
          min-height: 80px;
        }

        .error-message {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
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
