import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Perfil</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Dados e preferências do usuário.</p>
        </div>
      </div>
      <Card>
        <p style={{ marginTop: 0 }}>Nome: {user?.name}</p>
        <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>Role: {user?.role}</p>
        <Button variant="secondary" onClick={logout}>Sair</Button>
      </Card>
    </div>
  );
};
