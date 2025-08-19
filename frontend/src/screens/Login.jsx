import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', formData);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Login successful, redirecting...', data.user);
        
        // Redirect based on user role
        switch (data.user.role) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'OFFICER':
            navigate('/officer');
            break;
          default:
            navigate('/dashboard');
            break;
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--peacock), #00788C)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--peacock), #00788C)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            🏛️
          </div>
          <h2 style={{
            color: 'var(--peacock)',
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.95rem'
          }}>
            Sign in to access your government services
          </p>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--peacock)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--peacock)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#ccc' : 'var(--peacock)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = '#004a5a';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.background = 'var(--peacock)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.9rem'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--peacock)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Create Account
            </Link>
          </p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          <Link
            to="/"
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: 'var(--muted)'
        }}>
          <strong style={{ color: 'var(--peacock)' }}>Demo Accounts:</strong><br/>
          <div style={{ marginTop: '0.5rem', lineHeight: '1.4' }}>
            <strong>Admin:</strong> admin@gov.lk / admin123<br/>
            <strong>Officer:</strong> officer@gov.lk / officer123<br/>
            <strong>Citizen:</strong> citizen@gov.lk / citizen123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
