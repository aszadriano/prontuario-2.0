import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Patient } from '../data/patients';
import { maskCPF } from '../utils/masks';
import { formatDate } from '../utils/format';
import { usePatients } from '../hooks/usePatients';
import { Spinner } from '../components/Spinner';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const { patients: data, loading: isLoading, error, fetchPatients: refetch, createPatient } = usePatients();

  const showCreate = location.pathname.endsWith('/new');

  const filtered = (data || []).filter((patient: Patient) => {
    const term = query.toLowerCase();
    return (
      patient.name.toLowerCase().includes(term) ||
      patient.cpf.includes(term) ||
      patient.phone.includes(term)
    );
  });

  const triggerSync = () => {
    setLoading(true);
    setSyncMessage(null);
    refetch()
      .then(() => setSyncMessage('Base sincronizada com sucesso'))
      .finally(() => setLoading(false));
  };

  const handleCloseModal = () => {
    navigate('/patients');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createPatient(formData);
    setFormData({
      name: '',
      cpf: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setSyncMessage('Paciente cadastrado (simulacao)');
    handleCloseModal();
  };

  const columns = [
    {
      header: 'Paciente',
      accessor: (row: Patient) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.name}</strong>
          <small style={{ color: 'var(--color-text-tertiary)' }}>
            {maskCPF(row.cpf)} ? {row.phone}
          </small>
        </div>
      ),
    },
    { header: 'Idade', accessor: (row: Patient) => `${row.age ?? '-'} anos`, align: 'center' as const, width: '110px' },
    {
      header: 'Alergias',
      accessor: (row: Patient) =>
        (row.allergies?.length || 0) > 0 ? (
          <Badge tone="info">{row.allergies?.length}</Badge>
        ) : (
          <Badge tone="success">Sem registros</Badge>
        ),
      align: 'center' as const,
      width: '130px',
    },
    {
      header: 'Ultima consulta',
      accessor: (row: Patient) => (row.lastConsultation ? formatDate(row.lastConsultation) : '-'),
      align: 'center' as const,
      width: '160px',
    },
    {
      header: 'Acao',
      accessor: (row: Patient) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${row.id}`)}>
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${row.id}`)}>
            >
          </Button>
        </div>
      ),
      align: 'right' as const,
      width: '120px',
    },
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Pacientes</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            CPF mascarado por padrao (LGPD)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={triggerSync} loading={loading}>
            Sincronizar
          </Button>
          <Button variant="primary" onClick={() => navigate('/patients/new')}>
            Novo paciente
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-primary-soft)' }}>
          <Badge tone="info">Sucesso</Badge>
          <span>{syncMessage}</span>
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <Input
            name="patient-search"
            placeholder="Buscar por nome, CPF ou telefone"
            icon="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            containerStyle={{ flex: 1, minWidth: 260 }}
          />
          <Button variant="outline" size="sm">
            Filtros
          </Button>
        </div>

        {isLoading && (
          <div style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
            <Spinner size={28} />
          </div>
        )}
        {error && <p style={{ color: 'var(--color-error)' }}>Erro ao carregar pacientes.</p>}
        {!isLoading && !error && (
          <Table
            data={filtered}
            columns={columns}
            onRowClick={(row) => navigate(`/patients/${row.id}`)}
            getRowId={(row) => row.id}
          />
        )}
      </Card>

      {showCreate && (
        <div className="modal">
          <div className="modal__overlay" onClick={handleCloseModal} />
          <div className="modal__content">
            <Card>
              <div className="modal__header">
                <div>
                  <h2 style={{ margin: 0 }}>Novo paciente</h2>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                    Preencha os dados para simular o cadastro.
                  </p>
                </div>
                <button className="modal__close" onClick={handleCloseModal}>
                  x
                </button>
              </div>
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-row">
                  <Input
                    name="name"
                    label="Nome completo"
                    placeholder="Ex: Maria Silva"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    name="cpf"
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cpf: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    name="birthDate"
                    label="Data de nascimento"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  />
                  <Input
                    name="phone"
                    label="Telefone"
                    placeholder="(11) 90000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <Input
                  name="email"
                  label="E-mail"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  name="address"
                  label="Endereco"
                  placeholder="Rua, numero"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
                <div className="form-row">
                  <Input
                    name="city"
                    label="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  />
                  <Input
                    name="state"
                    label="Estado"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  />
                  <Input
                    name="zipCode"
                    label="CEP"
                    value={formData.zipCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button variant="outline" size="sm" type="button" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Cadastrar
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
