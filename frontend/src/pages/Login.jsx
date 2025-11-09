import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
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
      <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Welcome back</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#6b7280' }}>
          Sign in to orchestrate your omnichannel campaigns.
        </p>

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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Need to create an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
