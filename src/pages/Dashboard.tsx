import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { formatDate, formatDateTime } from '../utils/format';
import { maskCPF } from '../utils/masks';
import { usePatients } from '../hooks/usePatients';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';

const metrics = [
  { label: 'Pacientes ativos', value: 156, trend: '+12 este mes' },
  { label: 'Consultas hoje', value: 8, trend: '2 em andamento' },
  { label: 'Receitas emitidas', value: 12, trend: 'ultimos 7 dias' },
  { label: 'Pendencias', value: 3, trend: 'revisar agora' },
];

const quickActions = [
  { title: 'Nova consulta', description: 'Agende em segundos', cta: 'Agendar' },
  { title: 'Gerar receita', description: 'Prescricao rapida', cta: 'Emitir' },
  { title: 'Ver agenda', description: 'Disponibilidade do dia', cta: 'Abrir' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const { patients, loading, error } = usePatients();
  const nextAppointment = patients?.find((p: any) => p.nextConsultation);

  const handleAction = (id: string) => {
    setLoadingAction(id);
    setTimeout(() => setLoadingAction(null), 1200);
    if (id === 'Nova consulta') navigate('/agenda/new');
    if (id === 'Gerar receita') navigate('/prescriptions/new');
    if (id === 'Ver agenda') navigate('/agenda');
  };

  return (
    <div className="grid" style={{ gap: 24 }}>
      {loading && (
        <Card variant="highlight" title="Proxima consulta">
          <div style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
            <Spinner size={28} />
          </div>
        </Card>
      )}

      {!loading && error && (
        <Card variant="highlight" title="Proxima consulta">
          <p style={{ margin: 0, color: 'var(--color-error)' }}>Erro ao carregar proxima consulta.</p>
        </Card>
      )}

      {!loading && !error && nextAppointment && (
        <Card variant="highlight" title="Proxima consulta" className="dashboard-hero">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Badge tone="info">{formatDate(nextAppointment.nextConsultation!)}</Badge>
            <Badge tone="info">{formatDateTime(nextAppointment.nextConsultation!)}</Badge>
            <Badge tone="warning">Retorno</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{nextAppointment.name}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              CPF {maskCPF(nextAppointment.cpf)} • {nextAppointment.age} anos
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button size="sm" variant="primary">
              Iniciar atendimento
            </Button>
            <Button size="sm" variant="outline">
              Ver prontuario
            </Button>
          </div>
        </Card>
      )}

      <div className="dashboard-actions">
        {quickActions.map((action) => (
          <Card key={action.title} title={action.title}>
            <p style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>{action.description}</p>
            <Button
              size="sm"
              variant="outline"
              loading={loadingAction === action.title}
              onClick={() => handleAction(action.title)}
            >
              {action.cta}
            </Button>
          </Card>
        ))}
      </div>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <Card key={metric.label} variant="flat">
            <small style={{ color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {metric.label}
            </small>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{metric.value}</span>
              <span style={{ color: 'var(--color-primary-strong)', fontWeight: 600 }}>{metric.trend}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
