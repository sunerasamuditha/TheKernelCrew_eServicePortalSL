import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock departments data based on the landing page design
    const mockDepartments = [
      {
        id: '1',
        name: 'Immigration and Emigration',
        code: 'IMM',
        description: 'Passport and visa services for international travel',
        icon: '🛂',
        services: [
          { id: '1', name: 'Ordinary Passport', fee: 7500, processingDays: 21, description: 'Standard passport processing' },
          { id: '2', name: 'Express Passport', fee: 12500, processingDays: 7, description: 'Fast-track passport processing' },
          { id: '3', name: 'Urgent Passport', fee: 17500, processingDays: 3, description: 'Urgent passport processing' }
        ]
      },
      {
        id: '2',
        name: 'Department of Motor Traffic',
        code: 'DMT',
        description: 'Driving licenses and vehicle registration services',
        icon: '🚗',
        services: [
          { id: '4', name: 'New Driving License', fee: 2500, processingDays: 14, description: 'New driving license application' },
          { id: '5', name: 'License Renewal', fee: 1500, processingDays: 7, description: 'Driving license renewal' },
          { id: '6', name: 'Vehicle Registration', fee: 5000, processingDays: 10, description: 'Register new vehicle' }
        ]
      },
      {
        id: '3',
        name: 'Registrar General',
        code: 'RG',
        description: 'Birth, death, and marriage certificates',
        icon: '📋',
        services: [
          { id: '7', name: 'Birth Certificate', fee: 100, processingDays: 7, description: 'Birth certificate issuance' },
          { id: '8', name: 'Marriage Certificate', fee: 150, processingDays: 5, description: 'Marriage certificate issuance' },
          { id: '9', name: 'Death Certificate', fee: 100, processingDays: 5, description: 'Death certificate issuance' }
        ]
      },
      {
        id: '4',
        name: 'National Registration Department',
        code: 'NRD',
        description: 'National identity cards and registration',
        icon: '🆔',
        services: [
          { id: '10', name: 'New NIC', fee: 500, processingDays: 10, description: 'New National ID card application' },
          { id: '11', name: 'NIC Replacement', fee: 300, processingDays: 7, description: 'Replace lost or damaged NIC' }
        ]
      }
    ];

    setDepartments(mockDepartments);
    setLoading(false);
  }, []);

  const handleServiceSelect = (service) => {
    // Store selected service in localStorage for the booking flow
    try {
      localStorage.setItem('selectedService', JSON.stringify(service));
      // Navigate to register instead of booking since booking route doesn't exist
      navigate('/register');
    } catch (error) {
      console.error('Error storing service:', error);
      navigate('/register');
    }
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #005A70, #00788C)', 
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        background: 'rgba(0, 90, 112, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
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
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.3)';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '8rem 2rem 4rem',
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

        {/* Departments Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0, 90, 112, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: '#333'
              }}
              onClick={() => setSelectedDepartment(selectedDepartment?.id === dept.id ? null : dept)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 90, 112, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 90, 112, 0.1)';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                {dept.icon}
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#005A70'
              }}>
                {dept.name}
              </h3>
              <p style={{
                color: '#666',
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}>
                {dept.description}
              </p>
              
              {selectedDepartment?.id === dept.id && (
                <div style={{
                  borderTop: '1px solid #eee',
                  paddingTop: '1rem',
                  marginTop: '1rem'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#005A70'
                  }}>
                    Available Services:
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {dept.services.map((service) => (
                      <div
                        key={service.id}
                        style={{
                          background: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #e9ecef'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceSelect(service);
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#005A70';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                          e.currentTarget.style.color = '#333';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {service.name}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                            LKR {service.fee.toLocaleString()}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          opacity: '0.8'
                        }}>
                          {service.description} • {service.processingDays} days
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#005A70',
                fontWeight: '600'
              }}>
                {selectedDepartment?.id === dept.id ? 'Click a service to continue →' : 'Click to view services'}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
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
              transition: 'all 0.3s ease',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.3)';
            }}
          >
            Start Your Application Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
