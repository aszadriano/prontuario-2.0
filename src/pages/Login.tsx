import React from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = React.useState('medico@demo.com');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--color-background)' }}>
      <div style={{ width: 360, padding: 24, borderRadius: 18, boxShadow: '0 10px 40px rgba(0,0,0,0.06)', background: 'var(--color-surface)' }}>
        <h2 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>Prontuário Médico</h2>
        <p style={{ margin: '0 0 18px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Centralize histórico com segurança e rapidez.
        </p>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            name="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" loading={isLoading}>
            Entrar
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--color-text-muted)' }}>
          Precisa de acesso? Fale com o admin da clínica.
        </p>
      </div>
    </div>
  );
};
