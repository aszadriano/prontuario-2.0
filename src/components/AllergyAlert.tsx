// components/AllergyAlert.tsx
import React from 'react';
import { Allergy } from '../types/allergy';
import { Button } from './Button';
import { Badge } from './Badge';

interface AllergyAlertProps {
  conflicts: Allergy[];
  onCancel: () => void;
  onContinue: () => void;
  loading?: boolean;
}

const severityConfig = {
  high: { label: 'Alta', color: 'red', icon: '🔴' },
  moderate: { label: 'Moderada', color: 'yellow', icon: '🟡' },
  low: { label: 'Baixa', color: 'green', icon: '🟢' },
};

export const AllergyAlert: React.FC<AllergyAlertProps> = ({
  conflicts,
  onCancel,
  onContinue,
  loading,
}) => {
  return (
    <div className="allergy-alert-overlay" onClick={onCancel}>
      <div className="allergy-alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="allergy-alert-header">
          <div className="allergy-alert-icon">⚠️</div>
          <h2>Alerta de Alergia</h2>
        </div>

        <div className="allergy-alert-body">
          <p className="allergy-alert-message">
            O paciente possui <strong>{conflicts.length}</strong> alergia(s) que podem conflitar com os
            medicamentos selecionados:
          </p>

          <div className="allergy-conflicts-list">
            {conflicts.map((allergy) => {
              const config = severityConfig[allergy.severity];
              return (
                <div key={allergy.id} className="allergy-conflict-item">
                  <div className="allergy-conflict-header">
                    <span className="allergy-icon">{config.icon}</span>
                    <strong>{allergy.medication}</strong>
                    <Badge variant={config.color as any}>{config.label}</Badge>
                  </div>
                  <p className="allergy-conflict-reaction">
                    <span className="label">Reação:</span> {allergy.reaction}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="allergy-alert-warning">
            <strong>⚠️ Atenção:</strong> Prescrever medicamentos aos quais o paciente é alérgico pode
            causar reações adversas graves. Revise a prescrição antes de continuar.
          </div>
        </div>

        <div className="allergy-alert-footer">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar Prescrição
          </Button>
          <Button variant="primary" onClick={onContinue} loading={loading}>
            Continuar Mesmo Assim
          </Button>
        </div>

        <style>{`
          .allergy-alert-overlay {
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

          .allergy-alert-modal {
            background: #fff;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .allergy-alert-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .allergy-alert-icon {
            font-size: 32px;
          }

          .allergy-alert-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }

          .allergy-alert-body {
            padding: 24px;
          }

          .allergy-alert-message {
            font-size: 16px;
            color: #374151;
            margin-bottom: 20px;
          }

          .allergy-conflicts-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
          }

          .allergy-conflict-item {
            background: #fef3f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
          }

          .allergy-conflict-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .allergy-icon {
            font-size: 18px;
          }

          .allergy-conflict-header strong {
            font-size: 16px;
            color: #991b1b;
          }

          .allergy-conflict-reaction {
            font-size: 14px;
            color: #7c2d12;
            margin: 0;
          }

          .allergy-conflict-reaction .label {
            font-weight: 500;
          }

          .allergy-alert-warning {
            background: #fef3c7;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 16px;
            font-size: 14px;
            color: #78350f;
          }

          .allergy-alert-warning strong {
            display: block;
            margin-bottom: 4px;
          }

          .allergy-alert-footer {
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
