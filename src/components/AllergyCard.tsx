// components/AllergyCard.tsx
import React from 'react';
import clsx from 'clsx';
import { Allergy } from '../types/allergy';
import { Button } from './Button';
import { Badge } from './Badge';

interface AllergyCardProps {
  allergy: Allergy;
  onRemove: (allergyId: string) => void;
  loading?: boolean;
}

const severityConfig = {
  high: { label: 'Alta', color: 'red', icon: '🔴' },
  moderate: { label: 'Moderada', color: 'yellow', icon: '🟡' },
  low: { label: 'Baixa', color: 'green', icon: '🟢' },
};

export const AllergyCard: React.FC<AllergyCardProps> = ({ allergy, onRemove, loading }) => {
  const config = severityConfig[allergy.severity];
  const date = new Date(allergy.createdAt).toLocaleDateString('pt-BR');

  return (
    <div className="allergy-card">
      <div className="allergy-card-header">
        <div className="allergy-card-title">
          <span className="allergy-icon">{config.icon}</span>
          <h4>{allergy.medication}</h4>
        </div>
        <Badge variant={config.color as any}>{config.label}</Badge>
      </div>
      
      <div className="allergy-card-body">
        <div className="allergy-field">
          <span className="allergy-label">Reação:</span>
          <span className="allergy-value">{allergy.reaction}</span>
        </div>
        <div className="allergy-field">
          <span className="allergy-label">Registrado em:</span>
          <span className="allergy-value">{date}</span>
        </div>
      </div>

      <div className="allergy-card-footer">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(allergy.id)}
          loading={loading}
          disabled={loading}
        >
          Remover
        </Button>
      </div>

      <style>{`
        .allergy-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .allergy-card:hover {
          box-shadow: 0 2px 8px rgba(155, 135, 245, 0.1);
          border-color: #9b87f5;
        }

        .allergy-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .allergy-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .allergy-icon {
          font-size: 20px;
        }

        .allergy-card-title h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .allergy-card-body {
          margin-bottom: 12px;
        }

        .allergy-field {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .allergy-label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .allergy-value {
          font-size: 14px;
          color: #1f2937;
        }

        .allergy-card-footer {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};
