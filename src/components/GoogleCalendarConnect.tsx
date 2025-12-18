// components/GoogleCalendarConnect.tsx
import React, { useState, useEffect } from 'react';
import { GoogleCalendarStatus } from '../types/event';
import { googleCalendarService } from '../services/eventService';
import { Button } from './Button';
import { Card } from './Card';

export const GoogleCalendarConnect: React.FC = () => {
  const [status, setStatus] = useState<GoogleCalendarStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await googleCalendarService.getStatus();
      setStatus(data);
    } catch (err) {
      console.error('Erro ao obter status:', err);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const authUrl = await googleCalendarService.getAuthUrl();
      // Abre popup de autenticação
      const popup = window.open(authUrl, 'Google Calendar', 'width=600,height=700');

      // Aguarda callback
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          fetchStatus();
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar');
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError(null);

    try {
      await googleCalendarService.sync();
      await fetchStatus();
      alert('Sincronização concluída com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Deseja realmente desconectar o Google Calendar?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await googleCalendarService.disconnect();
      setStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desconectar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Integração Google Calendar">
      <div className="google-calendar-connect">
        {!status?.connected ? (
          <>
            <div className="status-badge disconnected">
              <span className="status-icon">❌</span>
              <span className="status-text">Não conectado</span>
            </div>
            <p className="description">
              Conecte sua conta Google para sincronizar automaticamente seus agendamentos e eventos.
            </p>
            <Button
              variant="primary"
              icon="link"
              onClick={handleConnect}
              loading={loading}
              disabled={loading}
            >
              🔗 Conectar com Google
            </Button>
          </>
        ) : (
          <>
            <div className="status-badge connected">
              <span className="status-icon">✅</span>
              <span className="status-text">Conectado</span>
            </div>
            <div className="connection-info">
              <div className="info-item">
                <span className="info-label">Conta:</span>
                <span className="info-value">{status.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Última sincronização:</span>
                <span className="info-value">
                  {new Date(status.lastSync).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="actions">
              <Button
                variant="primary"
                icon="refresh"
                onClick={handleSync}
                loading={loading}
                disabled={loading}
              >
                🔄 Sincronizar Agora
              </Button>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={loading}
              >
                Desconectar
              </Button>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        <style>{`
          .google-calendar-connect {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            width: fit-content;
          }

          .status-badge.connected {
            background: #d1fae5;
            color: #065f46;
          }

          .status-badge.disconnected {
            background: #fee2e2;
            color: #991b1b;
          }

          .status-icon {
            font-size: 16px;
          }

          .description {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          }

          .connection-info {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
          }

          .info-item {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }

          .info-item:last-child {
            margin-bottom: 0;
          }

          .info-label {
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
          }

          .info-value {
            font-size: 14px;
            color: #1f2937;
          }

          .actions {
            display: flex;
            gap: 12px;
          }

          .error-message {
            padding: 12px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            font-size: 14px;
            color: #991b1b;
          }
        `}</style>
      </div>
    </Card>
  );
};
