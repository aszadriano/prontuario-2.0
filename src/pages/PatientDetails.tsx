import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { maskCPF, maskPhone } from '../utils/masks';
import { formatDate, formatDateTime } from '../utils/format';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { usePatients } from '../hooks/usePatients';
import { Spinner } from '../components/Spinner';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, loading: isLoading } = usePatients();
  const patient = patients.find(p => p.id === id);
  const [loading, setLoading] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <Card>
        <p>Paciente não encontrado.</p>
        <Button variant="primary" onClick={() => navigate('/patients')}>
          Voltar para a lista
        </Button>
      </Card>
    );
  }

  const handleAction = (action: string) => {
    setLoading(action);
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <Button variant="ghost" icon="chevron-right" onClick={() => navigate(-1)}>
        Voltar
      </Button>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0' }}>{patient.name}</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              CPF {maskCPF(patient.cpf)} • {patient.age} anos • {maskPhone(patient.phone)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Badge tone="success">{patient.status === 'ativo' ? 'Ativo' : 'Pendente'}</Badge>
            {patient.nextConsultation && (
              <Badge tone="info">
                Próxima: {formatDate(patient.nextConsultation)} • {formatDateTime(patient.nextConsultation)}
              </Badge>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <Button variant="primary" loading={loading === 'atendimento'} onClick={() => handleAction('atendimento')}>
            Iniciar atendimento
          </Button>
          <Button variant="secondary" loading={loading === 'receita'} onClick={() => handleAction('receita')}>
            Gerar receita
          </Button>
          <Button variant="ghost" loading={loading === 'historico'} onClick={() => handleAction('historico')}>
            Ver histórico
          </Button>
        </div>
      </Card>

      <Card variant="flat" title={`Alergias (${patient.allergies?.length || 0})`}>
        {(patient.allergies?.length || 0) === 0 ? (
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Nenhuma alergia registrada.</p>
        ) : (
          <ul>
            {patient.allergies?.map((allergy: any) => (
              <li key={allergy} style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                {allergy}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Histórico de consultas">
        <div className="grid" style={{ gap: 12 }}>
          {patient.history?.map((entry: any) => (
            <div
              key={entry.id}
              className="card"
              style={{
                padding: 14,
                background: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <strong>{formatDate(entry.date)}</strong>
                <Badge tone="info">{formatDateTime(entry.date)}</Badge>
              </div>
              <p style={{ margin: '6px 0 0 0', fontWeight: 600 }}>{entry.reason}</p>
              <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-muted)' }}>{entry.notes}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
