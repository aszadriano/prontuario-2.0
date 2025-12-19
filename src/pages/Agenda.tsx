import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockTimeSlots as agendaSlots, TimeSlot } from '../data/agenda';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';

export const Agenda: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    patient: '',
    date: '',
    time: '',
    type: '',
    notes: '',
  });

  const showCreate = location.pathname.endsWith('/new');

  const handleCloseModal = () => {
    navigate('/agenda');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('Consulta cadastrada (simulacao)');
    setFormData({ patient: '', date: '', time: '', type: '', notes: '' });
    handleCloseModal();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Agenda</h1>
        <Button variant="primary" onClick={() => navigate('/agenda/new')}>Nova consulta</Button>
      </div>

      {message && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-primary-soft)' }}>
          <Badge tone="info">Sucesso</Badge>
          <span>{message}</span>
        </div>
      )}

      <Card>
        <p style={{ marginTop: 0 }}>
          Selecione um horario para editar, bloquear ou iniciar consulta.
        </p>
        <div className="grid" style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {agendaSlots.map((slot: TimeSlot) => (
            <div
              key={slot.time}
              style={{
                padding: 14,
                borderRadius: 14,
                background: 'var(--color-surface-strong)',
                border: '1px solid var(--color-border-light)',
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

      {showCreate && (
        <div className="modal">
          <div className="modal__overlay" onClick={handleCloseModal} />
          <div className="modal__content">
            <Card>
              <div className="modal__header">
                <div>
                  <h2 style={{ margin: 0 }}>Nova consulta</h2>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                    Preencha os dados para simular o agendamento.
                  </p>
                </div>
                <button className="modal__close" onClick={handleCloseModal}>x</button>
              </div>
              <form className="form-grid" onSubmit={handleSubmit}>
                <Input
                  name="patient"
                  label="Paciente"
                  placeholder="Nome do paciente"
                  value={formData.patient}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patient: e.target.value }))}
                  required
                />
                <div className="form-row">
                  <Input
                    name="date"
                    label="Data"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                  <Input
                    name="time"
                    label="Hora"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <Input
                  name="type"
                  label="Tipo"
                  placeholder="Consulta, retorno, exame"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                />
                <Input
                  name="notes"
                  label="Observacoes"
                  placeholder="Notas da consulta"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button variant="outline" size="sm" type="button" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Salvar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
