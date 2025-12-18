// components/RecordDetails.tsx
import React from 'react';
import { MedicalRecord } from '../types/record';
import { Button } from './Button';

interface RecordDetailsProps {
  record: MedicalRecord;
  onClose: () => void;
  onPrint: (recordId: string) => void;
  loading?: boolean;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({ record, onClose, onPrint, loading }) => {
  const date = new Date(record.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="record-details-overlay" onClick={onClose}>
      <div className="record-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="record-details-header">
          <div>
            <h2>Prontuário Médico</h2>
            <p className="record-meta">
              {date} • Dr(a). {record.doctorName}
            </p>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="record-details-body">
          <section className="record-section">
            <h3>Queixa Principal</h3>
            <p>{record.chiefComplaint}</p>
          </section>

          {record.historyOfPresentIllness && (
            <section className="record-section">
              <h3>História da Doença Atual</h3>
              <p>{record.historyOfPresentIllness}</p>
            </section>
          )}

          {record.physicalExam && (
            <section className="record-section">
              <h3>Exame Físico</h3>
              <p>{record.physicalExam}</p>
            </section>
          )}

          <section className="record-section">
            <h3>Diagnóstico</h3>
            <p>{record.diagnosis}</p>
          </section>

          <section className="record-section">
            <h3>Conduta</h3>
            <p>{record.plan}</p>
          </section>
        </div>

        <div className="record-details-footer">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            variant="primary"
            icon="printer"
            onClick={() => onPrint(record.id)}
            loading={loading}
          >
            Imprimir
          </Button>
        </div>

        <style>{`
          .record-details-overlay {
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

          .record-details-modal {
            background: #fff;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .record-details-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .record-details-header h2 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }

          .record-meta {
            margin: 0;
            font-size: 14px;
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

          .record-details-body {
            padding: 24px;
          }

          .record-section {
            margin-bottom: 24px;
          }

          .record-section:last-child {
            margin-bottom: 0;
          }

          .record-section h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 600;
            color: #9b87f5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .record-section p {
            margin: 0;
            font-size: 15px;
            color: #374151;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .record-details-footer {
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
