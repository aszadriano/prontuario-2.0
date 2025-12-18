import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockTimeSlots as agendaSlots, TimeSlot } from '../data/agenda';
import { Badge } from '../components/Badge';

export const Agenda: React.FC = () => {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Agenda</h1>
        <Button variant="primary">Nova consulta</Button>
      </div>
      <Card>
        <p style={{ marginTop: 0 }}>
          Agenda otimizada para mobile: hambúrguer abre menu lateral e navegação em até 2 níveis.
        </p>
        <p style={{ margin: '4px 0 16px 0', color: 'var(--color-text-muted)' }}>
          Selecione um horário para editar, bloquear ou iniciar consulta.
        </p>
        <div className="grid" style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {agendaSlots.map((slot: TimeSlot) => (
            <div
              key={slot.time}
              style={{
                padding: 14,
                borderRadius: 14,
                background: 'var(--color-surface-alt)',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{slot.time}</strong>
                <Badge tone="info">{slot.status}</Badge>
              </div>
              {slot.patient && <p style={{ margin: '6px 0 0 0' }}>{slot.patient}</p>}
              {slot.note && <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-muted)' }}>{slot.note}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <Button size="sm" variant="outline">Editar</Button>
                {slot.status === 'livre' ? (
                  <Button size="sm" variant="primary">Agendar</Button>
                ) : (
                  <Button size="sm" variant="ghost">Detalhes</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
