// components/MedicationDetails.tsx
import React from 'react';
import { Medication } from '../types/medication';
import { Button } from './Button';
import { Badge } from './Badge';

interface MedicationDetailsProps {
  medication: Medication;
  onClose: () => void;
  onAddToPrescription?: (medication: Medication) => void;
  showAddButton?: boolean;
}

export const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  medication,
  onClose,
  onAddToPrescription,
  showAddButton = false,
}) => {
  return (
    <div className="medication-details-overlay" onClick={onClose}>
      <div className="medication-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="medication-details-header">
          <div>
            <h2>{medication.name}</h2>
            <p className="medication-dosage">{medication.dosage}</p>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="medication-details-body">
          <div className="detail-section">
            <div className="detail-label">Categoria</div>
            <Badge variant="primary">{medication.category}</Badge>
          </div>

          <div className="detail-section">
            <h3>Posologia</h3>
            <p>{medication.posology || 'Informação não disponível'}</p>
          </div>

          {medication.contraindications && medication.contraindications.length > 0 && (
            <div className="detail-section">
              <h3>Contraindicações</h3>
              <ul className="detail-list">
                {medication.contraindications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {medication.interactions && medication.interactions.length > 0 && (
            <div className="detail-section">
              <h3>Interações Medicamentosas</h3>
              <ul className="detail-list">
                {medication.interactions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="medication-details-footer">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {showAddButton && onAddToPrescription && (
            <Button
              variant="primary"
              onClick={() => {
                onAddToPrescription(medication);
                onClose();
              }}
            >
              Adicionar à Prescrição
            </Button>
          )}
        </div>

        <style>{`
          .medication-details-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .medication-details-modal {
            background: #fff;
            border-radius: 12px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .medication-details-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .medication-details-header h2 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }

          .medication-dosage {
            margin: 0;
            font-size: 16px;
            color: #6b7280;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 24px;
            color: #9ca3af;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .close-button:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .medication-details-body {
            padding: 24px;
          }

          .detail-section {
            margin-bottom: 24px;
          }

          .detail-section:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .detail-section h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 600;
            color: #9b87f5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .detail-section p {
            margin: 0;
            font-size: 15px;
            color: #374151;
            line-height: 1.6;
          }

          .detail-list {
            margin: 0;
            padding-left: 20px;
          }

          .detail-list li {
            font-size: 15px;
            color: #374151;
            line-height: 1.6;
            margin-bottom: 8px;
          }

          .detail-list li:last-child {
            margin-bottom: 0;
          }

          .medication-details-footer {
            padding: 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
        `}</style>
      </div>
    </div>
  );
};
