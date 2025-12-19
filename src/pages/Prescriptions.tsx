import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';

type Prescription = {
  id: string;
  patient: string;
  date: string;
  status: 'assinada' | 'pendente' | 'enviada';
};

const initialPrescriptions: Prescription[] = [
  { id: 'rx1', patient: 'Maria Silva', date: '2024-12-01', status: 'assinada' },
  { id: 'rx2', patient: 'Joao Santos', date: '2024-11-28', status: 'enviada' },
  { id: 'rx3', patient: 'Ana Costa', date: '2024-11-20', status: 'pendente' }
];

export const Prescriptions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>(initialPrescriptions);
  const [message, setMessage] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    patient: '',
    date: '',
    status: 'pendente',
  });

  const showCreate = location.pathname.endsWith('/new');

  const handleCloseModal = () => {
    navigate('/prescriptions');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newItem: Prescription = {
      id: `rx-${Date.now()}`,
      patient: formData.patient,
      date: formData.date || new Date().toISOString().slice(0, 10),
      status: formData.status as Prescription['status'],
    };
    setPrescriptions((prev) => [newItem, ...prev]);
    setMessage('Prescricao gerada (simulacao)');
    setFormData({ patient: '', date: '', status: 'pendente' });
    handleCloseModal();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Prescricoes</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Emitir e revisar receitas digitais.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/prescriptions/new')}>Nova prescricao</Button>
      </div>

      {message && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-primary-soft)' }}>
          <Badge tone="info">Sucesso</Badge>
          <span>{message}</span>
        </div>
      )}

      <Card title="Prescricoes recentes">
        <Table
          data={prescriptions}
          getRowId={(row) => row.id}
          columns={[
            { header: 'Paciente', accessor: (row) => row.patient },
            { header: 'Data', accessor: (row) => row.date, align: 'center' },
            { header: 'Status', accessor: (row) => row.status, align: 'center' }
          ]}
        />
      </Card>

      {showCreate && (
        <div className="modal">
          <div className="modal__overlay" onClick={handleCloseModal} />
          <div className="modal__content">
            <Card>
              <div className="modal__header">
                <div>
                  <h2 style={{ margin: 0 }}>Nova prescricao</h2>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                    Preencha os dados para simular a emissao.
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
                <Input
                  name="date"
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                />
                <Input
                  name="status"
                  label="Status"
                  placeholder="pendente, assinada, enviada"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button variant="outline" size="sm" type="button" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Gerar
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
