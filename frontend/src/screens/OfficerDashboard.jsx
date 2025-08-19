import React, { useState, useEffect } from 'react';

const OfficerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock data for officer appointments
    const mockAppointments = [
      {
        id: '1',
        appointmentNumber: 'APP2025001',
        appointmentTime: '09:30',
        user: {
          fullName: 'Anura Perera',
          email: 'anura@example.com',
          mobile: '+94771234567',
          nic: '900123456V'
        },
        service: {
          name: 'Ordinary Passport',
          department: { name: 'Immigration and Emigration' }
        },
        status: 'CONFIRMED',
        documents: [
          { id: '1', documentType: 'Birth Certificate', status: 'VERIFIED' },
          { id: '2', documentType: 'NIC', status: 'VERIFIED' },
          { id: '3', documentType: 'Guarantor Form', status: 'PENDING' }
        ]
      },
      {
        id: '2',
        appointmentNumber: 'APP2025002',
        appointmentTime: '10:00',
        user: {
          fullName: 'Sita Fernando',
          email: 'sita@example.com',
          mobile: '+94772345678',
          nic: '891234567V'
        },
        service: {
          name: 'Express Passport',
          department: { name: 'Immigration and Emigration' }
        },
        status: 'SCHEDULED',
        documents: [
          { id: '4', documentType: 'Birth Certificate', status: 'PENDING' },
          { id: '5', documentType: 'NIC', status: 'VERIFIED' }
        ]
      }
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus, notes = '') => {
    try {
      // Mock API call
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      );
      setAppointments(updatedAppointments);
      
      alert(`Appointment ${appointmentId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#28a745';
      case 'IN_PROGRESS': return '#007bff';
      case 'CONFIRMED': return '#17a2b8';
      case 'REQUIRES_INFO': return '#ffc107';
      case 'NO_SHOW': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#ffc107';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading appointments...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
<<<<<<< Updated upstream
              color: 'var(--peacock)', 
=======
              color: '#005A70', 
>>>>>>> Stashed changes
              fontSize: '2rem', 
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              Officer Dashboard
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Good morning, {user?.fullName || 'Officer'}! Today's appointments at {user?.department?.name || 'Your Department'}
            </p>
          </div>
          <div style={{
<<<<<<< Updated upstream
            background: 'var(--peacock)',
=======
            background: '#005A70',
>>>>>>> Stashed changes
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div style={{
        display: 'grid',
        gap: '1.5rem'
      }}>
        {appointments.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
<<<<<<< Updated upstream
            <h3 style={{ color: 'var(--peacock)', marginBottom: '0.5rem' }}>No Appointments Today</h3>
=======
            <h3 style={{ color: '#005A70', marginBottom: '0.5rem' }}>No Appointments Today</h3>
>>>>>>> Stashed changes
            <p style={{ color: 'var(--muted)' }}>You have no scheduled appointments for today.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '2rem',
                alignItems: 'start'
              }}>
                {/* Appointment Info */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
<<<<<<< Updated upstream
                      background: 'var(--peacock)',
=======
                      background: '#005A70',
>>>>>>> Stashed changes
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {appointment.appointmentTime}
                    </div>
                    <div style={{
                      background: getStatusColor(appointment.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {appointment.status}
                    </div>
                  </div>
                  
                  <h3 style={{
<<<<<<< Updated upstream
                    color: 'var(--peacock)',
=======
                    color: '#005A70',
>>>>>>> Stashed changes
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {appointment.appointmentNumber}
                  </h3>
                  
                  <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                    {appointment.service.name}
                  </div>
                </div>

                {/* Citizen Info */}
                <div>
                  <h4 style={{
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem'
                  }}>
                    Citizen Information
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
<<<<<<< Updated upstream
                      <strong style={{ color: 'var(--peacock)' }}>Name:</strong>{' '}
                      <span>{appointment.user.fullName}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--peacock)' }}>NIC:</strong>{' '}
                      <span>{appointment.user.nic}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--peacock)' }}>Email:</strong>{' '}
                      <span>{appointment.user.email}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--peacock)' }}>Mobile:</strong>{' '}
=======
                      <strong style={{ color: '#005A70' }}>Name:</strong>{' '}
                      <span>{appointment.user.fullName}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#005A70' }}>NIC:</strong>{' '}
                      <span>{appointment.user.nic}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#005A70' }}>Email:</strong>{' '}
                      <span>{appointment.user.email}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#005A70' }}>Mobile:</strong>{' '}
>>>>>>> Stashed changes
                      <span>{appointment.user.mobile}</span>
                    </div>
                  </div>
                </div>

                {/* Documents & Actions */}
                <div>
                  <h4 style={{
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem'
                  }}>
                    Documents ({appointment.documents.length})
                  </h4>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {appointment.documents.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          background: '#f8f9fa',
                          borderRadius: '6px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span>{doc.documentType}</span>
                        <div style={{
                          background: getDocumentStatusColor(doc.status),
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {doc.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'IN_PROGRESS')}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Start Process
                      </button>
                    )}
                    
                    {appointment.status === 'IN_PROGRESS' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'REQUIRES_INFO')}
                          style={{
                            background: '#ffc107',
                            color: '#000',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Request Info
                        </button>
                      </>
                    )}
                    
                    {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'NO_SHOW')}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Mark No-Show
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
