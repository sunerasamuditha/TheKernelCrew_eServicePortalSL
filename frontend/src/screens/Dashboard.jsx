import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock appointments data for all services
    const mockAppointments = [
      {
        id: 1,
        appointmentNumber: 'PSP-2024-001234',
        service: { name: 'Passport Application', department: { name: 'Immigration and Emigration' } },
        appointmentDate: '2024-01-25',
        appointmentTime: '10:00',
        status: 'CONFIRMED',
        officeLocation: 'Battaramulla Office'
      },
      {
        id: 2,
        appointmentNumber: 'DLI-2024-005678',
        service: { name: 'Driving License Renewal', department: { name: 'Department of Motor Traffic' } },
        appointmentDate: '2024-01-28',
        appointmentTime: '14:30',
        status: 'SCHEDULED',
        officeLocation: 'Werahera Office'
      },
      {
        id: 3,
        appointmentNumber: 'BRC-2024-009012',
        service: { name: 'Birth Certificate', department: { name: 'Registrar General' } },
        appointmentDate: '2024-01-30',
        appointmentTime: '09:15',
        status: 'IN_PROGRESS',
        officeLocation: 'Colombo Office'
      }
    ];
    
    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#28a745';
      case 'SCHEDULED': return '#007bff';
      case 'IN_PROGRESS': return '#17a2b8';
      case 'COMPLETED': return '#6f42c1';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <Sidebar />
        <main className="main">
          <Topbar />
          
          <div style={{ padding: '2rem' }}>
            {/* Welcome Section */}
            <div style={{
              background: 'linear-gradient(135deg, var(--peacock) 0%, #1a365d 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              marginBottom: '2rem'
            }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Welcome back, {user?.fullName || 'Citizen'}! 👋
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Here's an overview of your government service appointments and applications.
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <h3 style={{ color: 'var(--peacock)', fontSize: '1.5rem', fontWeight: '700' }}>
                  {appointments.length}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Active Appointments</p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
                <h3 style={{ color: 'var(--peacock)', fontSize: '1.5rem', fontWeight: '700' }}>
                  {new Set(appointments.map(a => a.service.department.name)).size}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Departments</p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
                <h3 style={{ color: 'var(--peacock)', fontSize: '1.5rem', fontWeight: '700' }}>
                  {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'SCHEDULED').length}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Upcoming</p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ color: 'var(--peacock)', fontSize: '1.5rem', fontWeight: '700' }}>
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Completed</p>
              </div>
            </div>

            {/* Appointments List */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--peacock)', fontSize: '1.5rem', fontWeight: '700' }}>
                  My Appointments
                </h2>
                <button style={{
                  background: 'var(--peacock)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📋</span>
                  Book New Appointment
                </button>
              </div>

              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No appointments yet</h3>
                  <p>Book your first government service appointment to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {appointments.map(appointment => (
                    <div key={appointment.id} style={{
                      border: '1px solid var(--card-border)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      background: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{
                              background: getStatusColor(appointment.status),
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              {appointment.status}
                            </span>
                            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                              {appointment.appointmentNumber}
                            </span>
                          </div>
                          <h3 style={{ color: 'var(--peacock)', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {appointment.service.name}
                          </h3>
                          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                            {appointment.service.department.name}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--text)', fontWeight: '600', fontSize: '1rem' }}>
                            {formatDate(appointment.appointmentDate)}
                          </div>
                          <div style={{ color: 'var(--peacock)', fontWeight: '600', fontSize: '1.1rem' }}>
                            {appointment.appointmentTime}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--muted)' }}>📍</span>
                          <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                            {appointment.officeLocation}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            background: 'transparent',
                            color: 'var(--peacock)',
                            border: '1px solid var(--peacock)',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}>
                            View Details
                          </button>
                          <button style={{
                            background: 'var(--peacock)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}>
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Footer />
        </main>
      </div>
      <FloatingChatbot />
    </>
  );
};

export default Dashboard;
