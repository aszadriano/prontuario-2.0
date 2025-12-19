import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Icon } from './Icon';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'home' },
    {
      path: '/patients',
      label: 'Pacientes',
      icon: 'users',
      children: [
        { path: '/patients', label: 'Lista' },
        { path: '/patients/new', label: 'Cadastrar' },
      ],
    },
    { path: '/agenda', label: 'Agenda', icon: 'calendar' },
    { path: '/prescriptions', label: 'Prescricoes', icon: 'report' },
    { path: '/profile', label: 'Perfil', icon: 'settings' },
  ];

  const showTopbarActions =
    location.pathname === '/' || location.pathname.startsWith('/patients');

  return (
    <div className="layout">
      {sidebarOpen && <div className="sidebar__overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__brand-avatar">SM</div>
            <div>
              <h1 className="sidebar__logo">SienaMed</h1>
              <p className="sidebar__tagline">Lavanda Edition</p>
            </div>
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <div key={item.path} className="sidebar__nav-group">
                <Link to={item.path} className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
                  <span className="sidebar__icon">
                    <Icon name={item.icon} size={18} />
                  </span>
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
          <button className="topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Icon name="menu" size={18} />
          </button>
          <div className="topbar__title">
            <div className="topbar__name">SienaMed</div>
          </div>
          <div className="topbar__search">
            <input type="text" placeholder="Buscar paciente, CPF ou telefone" />
          </div>
          {showTopbarActions && (
            <div className="topbar__actions">
              <Button variant="outline" size="sm" onClick={() => navigate('/agenda/new')}>
                Nova consulta
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/patients/new')}>
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
