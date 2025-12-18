import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/patients', label: 'Pacientes', icon: '👥' },
    { path: '/agenda', label: 'Agenda', icon: '📅' },
    { path: '/prescriptions', label: 'Prescrições', icon: '💊' },
    { path: '/medications', label: 'Medicamentos', icon: '🔍' },
    { path: '/profile', label: 'Perfil', icon: '⚙️' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__header">
          <h1 className="sidebar__logo">Prontuário 2.0</h1>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link ${
                location.pathname === item.path ? 'sidebar__link--active' : ''
              }`}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </div>
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
        <Outlet />
      </main>
    </div>
  );
};
