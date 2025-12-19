import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    {
      path: '/patients',
      label: 'Pacientes',
      icon: '👥',
      children: [
        { path: '/patients', label: 'Lista' },
        { path: '/patients/new', label: 'Cadastrar' },
      ],
    },
    { path: '/agenda', label: 'Agenda', icon: '📅' },
    { path: '/prescriptions', label: 'Relatorios', icon: '📄' },
    { path: '/profile', label: 'Perfil', icon: '⚙️' },
  ];

  const showTopbarActions =
    location.pathname === '/' || location.pathname.startsWith('/patients');

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__brand-avatar">MS</div>
            <div>
              <h1 className="sidebar__logo">MedSystem</h1>
              <p className="sidebar__tagline">Lavanda Edition</p>
            </div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <div key={item.path} className="sidebar__nav-group">
                <Link to={item.path} className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
                  <span className="sidebar__icon">{item.icon}</span>
                  <span className="sidebar__label">{item.label}</span>
                </Link>
                {isActive && item.children && (
                  <div className="sidebar__subnav">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`sidebar__sublink ${
                          location.pathname === child.path ? 'sidebar__sublink--active' : ''
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar__notice">
          <div className="sidebar__notice-title">LGPD ativa</div>
          <div className="sidebar__notice-text">CPFs mascarados na listagem e no dashboard.</div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">{user?.name.charAt(0).toUpperCase()}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.name}</div>
              <div className="sidebar__user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar__title">
            <div className="topbar__name">Prontuario 2.0</div>
            <div className="topbar__subtitle">Fluxo enxuto e seguro</div>
          </div>
          <div className="topbar__search">
            <input type="text" placeholder="Buscar paciente, CPF ou telefone" />
          </div>
          {showTopbarActions && (
            <div className="topbar__actions">
              <Button variant="outline" size="sm">
                Nova consulta
              </Button>
              <Button variant="primary" size="sm">
                Novo paciente
              </Button>
            </div>
          )}
        </header>
        <Outlet />
      </main>
    </div>
  );
};
