// components/AppointmentCard.tsx
import React from 'react';
import { Appointment } from '../types/appointment';
import { Button } from './Button';
import { Badge } from './Badge';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
  onComplete: (id: string) => void;
  loading?: boolean;
}

const typeLabels = {
  consultation: 'Consulta',
  return: 'Retorno',
  exam: 'Exame',
  procedure: 'Procedimento',
};

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'blue' },
  confirmed: { label: 'Confirmado', color: 'green' },
  completed: { label: 'Concluído', color: 'gray' },
  cancelled: { label: 'Cancelado', color: 'red' },
  no_show: { label: 'Faltou', color: 'yellow' },
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onCancel,
  onConfirm,
  onComplete,
  loading,
}) => {
  const config = statusConfig[appointment.status];
  const date = new Date(appointment.date).toLocaleDateString('pt-BR');

  const canEdit = appointment.status === 'scheduled' || appointment.status === 'confirmed';
  const canConfirm = appointment.status === 'scheduled';
  const canComplete = appointment.status === 'confirmed';
  const canCancel = appointment.status !== 'cancelled' && appointment.status !== 'completed';

  return (
    <div className="appointment-card">
      <div className="appointment-card-header">
        <div>
          <h4 className="patient-name">{appointment.patientName}</h4>
          <p className="appointment-type">{typeLabels[appointment.type]}</p>
        </div>
        <Badge variant={config.color as any}>{config.label}</Badge>
      </div>

      <div className="appointment-card-body">
        <div className="appointment-info">
          <span className="info-icon">📅</span>
          <span className="info-text">{date}</span>
        </div>
        <div className="appointment-info">
          <span className="info-icon">🕐</span>
          <span className="info-text">{appointment.time}</span>
        </div>
        {appointment.notes && (
          <div className="appointment-notes">
            <span className="notes-label">Obs:</span> {appointment.notes}
          </div>
        )}
      </div>

      <div className="appointment-card-footer">
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(appointment)}
            disabled={loading}
          >
            Editar
          </Button>
        )}
        {canConfirm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(appointment.id)}
            disabled={loading}
          >
            Confirmar
          </Button>
        )}
        {canComplete && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onComplete(appointment.id)}
            disabled={loading}
          >
            Concluir
          </Button>
        )}
        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(appointment.id)}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
      </div>

      <style>{`
        .appointment-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .appointment-card:hover {
          box-shadow: 0 2px 8px rgba(155, 135, 245, 0.1);
          border-color: #9b87f5;
        }

        .appointment-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .patient-name {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .appointment-type {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .appointment-card-body {
          margin-bottom: 12px;
        }

        .appointment-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-icon {
          font-size: 16px;
        }

        .info-text {
          font-size: 14px;
          color: #374151;
        }

        .appointment-notes {
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #f3f4f6;
        }

        .notes-label {
          font-weight: 500;
        }

        .appointment-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
