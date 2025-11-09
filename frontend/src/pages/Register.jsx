import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at top, #c7d2fe 0%, #e0e7ff 35%, #f8fafc 70%)',
      }}
    >
      <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: 450 }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Create your workspace</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#6b7280' }}>
          Launch your first multichannel campaign in minutes.
        </p>

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <div className="error-text">{error}</div>}

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
