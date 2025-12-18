// components/MedicationCard.tsx
import React from 'react';
import { Medication } from '../types/medication';
import { Button } from './Button';
import { Badge } from './Badge';

interface MedicationCardProps {
  medication: Medication;
  onViewDetails: (medication: Medication) => void;
  onAdd?: (medication: Medication) => void;
  showAddButton?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onViewDetails,
  onAdd,
  showAddButton = false,
}) => {
  return (
    <div className="medication-card">
      <div className="medication-card-header">
        <div>
          <h4 className="medication-name">{medication.name}</h4>
          <p className="medication-dosage">{medication.dosage}</p>
        </div>
        <Badge variant="primary">{medication.category}</Badge>
      </div>

      <div className="medication-card-footer">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(medication)}>
          Ver Detalhes
        </Button>
        {showAddButton && onAdd && (
          <Button variant="primary" size="sm" onClick={() => onAdd(medication)}>
            Adicionar
          </Button>
        )}
      </div>

      <style>{`
        .medication-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .medication-card:hover {
          box-shadow: 0 2px 8px rgba(155, 135, 245, 0.1);
          border-color: #9b87f5;
        }

        .medication-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .medication-name {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .medication-dosage {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .medication-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};
