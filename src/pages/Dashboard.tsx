import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { formatDate, formatDateTime } from '../utils/format';
import { maskCPF } from '../utils/masks';
import { usePatients } from '../hooks/usePatients';
import { Spinner } from '../components/Spinner';

const metrics = [
  { label: 'Pacientes ativos', value: 156, trend: '+12 este mês' },
  { label: 'Consultas hoje', value: 8, trend: '2 em andamento' },
  { label: 'Receitas emitidas', value: 12, trend: 'últimos 7 dias' },
  { label: 'Pendências', value: 3, trend: 'revisar agora' }
];

const quickActions = [
  { title: 'Nova consulta', description: 'Agende em segundos', cta: 'Agendar' },
  { title: 'Gerar receita', description: 'Prescrição rápida', cta: 'Emitir' },
  { title: 'Ver agenda', description: 'Disponibilidade do dia', cta: 'Abrir' }
];

export const Dashboard: React.FC = () => {
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const { patients, loading, error } = usePatients();
  const nextAppointment = patients?.find((p: any) => p.nextConsultation);

  const handleAction = (id: string) => {
    setLoadingAction(id);
    setTimeout(() => setLoadingAction(null), 1200);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      {loading && (
        <Card variant="highlight" title="Próxima consulta">
          <div style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
            <Spinner size={28} />
          </div>
        </Card>
      )}

      {!loading && error && (
        <Card variant="highlight" title="Próxima consulta">
          <p style={{ margin: 0, color: 'var(--color-danger)' }}>Erro ao carregar próxima consulta.</p>
        </Card>
      )}

      {!loading && !error && nextAppointment && (
        <Card
          variant="highlight"
          title="Próxima consulta"
          className="hero-card"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Badge tone="info">{formatDate(nextAppointment.nextConsultation!)}</Badge>
              <Badge tone="info">{formatDateTime(nextAppointment.nextConsultation!)}</Badge>
              <Badge tone="warning">Retorno</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{nextAppointment.name}</div>
              <div style={{ fontWeight: 600, opacity: 0.92 }}>
                CPF {maskCPF(nextAppointment.cpf)} • {nextAppointment.age} anos
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button size="md" variant="primary">
                Iniciar atendimento
              </Button>
              <Button size="md" variant="outline">
                Ver prontuário
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid" style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {quickActions.map((action) => (
          <Card key={action.title} title={action.title}>
            <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>{action.description}</p>
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

      <div className="grid" style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {metrics.map((metric) => (
          <Card key={metric.label} variant="flat">
            <small style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {metric.label}
            </small>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>{metric.value}</span>
              <span style={{ color: 'var(--color-primary-strong)', fontWeight: 700 }}>{metric.trend}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
