// components/RecordCard.tsx
import React from 'react';
import { MedicalRecord } from '../types/record';
import { Button } from './Button';

interface RecordCardProps {
  record: MedicalRecord;
  onViewDetails: (record: MedicalRecord) => void;
  onPrint: (recordId: string) => void;
  loading?: boolean;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onViewDetails,
  onPrint,
  loading,
}) => {
  const date = new Date(record.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="record-card">
      <div className="record-card-header">
        <div className="record-date">
          <span className="record-icon">📅</span>
          <span className="record-date-text">{date}</span>
        </div>
        <span className="record-doctor">Dr(a). {record.doctorName}</span>
      </div>

      <div className="record-card-body">
        <div className="record-section">
          <strong>Queixa Principal:</strong>
          <p>{truncate(record.chiefComplaint, 100)}</p>
        </div>

        {record.diagnosis && (
          <div className="record-section">
            <strong>Diagnóstico:</strong>
            <p>{truncate(record.diagnosis, 100)}</p>
          </div>
        )}

        {record.plan && (
          <div className="record-section">
            <strong>Conduta:</strong>
            <p>{truncate(record.plan, 100)}</p>
          </div>
        )}
      </div>

      <div className="record-card-footer">
        <Button
          variant="outline"
          size="sm"
          icon="eye"
          onClick={() => onViewDetails(record)}
          disabled={loading}
        >
          Ver Detalhes
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="printer"
          onClick={() => onPrint(record.id)}
          loading={loading}
          disabled={loading}
        >
          Imprimir
        </Button>
      </div>

      <style>{`
        .record-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .record-card:hover {
          box-shadow: 0 2px 8px rgba(155, 135, 245, 0.1);
          border-color: #9b87f5;
        }

        .record-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .record-date {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .record-icon {
          font-size: 20px;
        }

        .record-date-text {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .record-doctor {
          font-size: 14px;
          color: #6b7280;
        }

        .record-card-body {
          margin-bottom: 16px;
        }

        .record-section {
          margin-bottom: 12px;
        }

        .record-section:last-child {
          margin-bottom: 0;
        }

        .record-section strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .record-section p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .record-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};
