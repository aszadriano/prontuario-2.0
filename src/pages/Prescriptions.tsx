import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';

type Prescription = {
  id: string;
  patient: string;
  date: string;
  status: 'assinada' | 'pendente' | 'enviada';
};

const mockPrescriptions: Prescription[] = [
  { id: 'rx1', patient: 'Maria Silva', date: '2024-12-01', status: 'assinada' },
  { id: 'rx2', patient: 'João Santos', date: '2024-11-28', status: 'enviada' },
  { id: 'rx3', patient: 'Ana Costa', date: '2024-11-20', status: 'pendente' }
];

export const Prescriptions: React.FC = () => {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Prescrições</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Emitir e revisar receitas digitais.</p>
        </div>
        <Button variant="primary">Nova prescrição</Button>
      </div>

      <Card title="Prescrições recentes">
        <Table
          data={mockPrescriptions}
          getRowId={(row) => row.id}
          columns={[
            { header: 'Paciente', accessor: (row) => row.patient },
            { header: 'Data', accessor: (row) => row.date, align: 'center' },
            { header: 'Status', accessor: (row) => row.status, align: 'center' }
          ]}
        />
      </Card>
    </div>
  );
};
