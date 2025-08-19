import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleLandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #005A70, #00788C)', 
      minHeight: '100vh',
      color: 'white',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #005A70, #00788C)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1.2rem'
          }}>
            🏛️
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            Government Services Portal
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '0.7rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button 
            onClick={handleGetStarted}
            style={{
              padding: '0.7rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFB347 0%, #FF8C42 50%, #FF6B35 100%)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          Digital Government Services
        </h1>
        <p style={{
          fontSize: '1.3rem',
          fontWeight: '400',
          marginBottom: '3rem',
          opacity: '0.9',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          Access all government services with our secure, AI-powered unified portal
        </p>

        {/* Simple Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            color: '#333',
            boxShadow: '0 10px 40px rgba(0, 90, 112, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛂</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#005A70' }}>
              Immigration and Emigration
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Passport and visa services for international travel
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            color: '#333',
            boxShadow: '0 10px 40px rgba(0, 90, 112, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#005A70' }}>
              Department of Motor Traffic
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Driving licenses and vehicle registration services
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            color: '#333',
            boxShadow: '0 10px 40px rgba(0, 90, 112, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#005A70' }}>
              Registrar General
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Birth, death, and marriage certificates
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            color: '#333',
            boxShadow: '0 10px 40px rgba(0, 90, 112, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🆔</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#005A70' }}>
              National Registration Department
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              National identity cards and registration
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button
            onClick={handleGetStarted}
            style={{
              fontSize: '1.2rem',
              padding: '1rem 3rem',
              background: 'linear-gradient(135deg, #FFB347 0%, #FF8C42 50%, #FF6B35 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
            }}
          >
            Start Your Application Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default SimpleLandingPage;
