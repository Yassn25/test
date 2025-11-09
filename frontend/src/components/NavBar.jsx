import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/campaigns', label: 'Campaigns' },
];

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.15rem',
            }}
          >
            M
          </div>
          <div>
            <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>Marketing</span>
            <span style={{ color: '#cbd5f5', fontSize: '0.75rem' }}>MVP Control Center</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                color: isActive ? '#fff' : '#cbd5f5',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.01em',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', color: '#f8fafc', fontWeight: 600 }}>
              {user?.name}
            </span>
            <span style={{ color: '#cbd5f5', fontSize: '0.75rem' }}>{user?.email}</span>
          </div>
          <button type="button" className="button secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
