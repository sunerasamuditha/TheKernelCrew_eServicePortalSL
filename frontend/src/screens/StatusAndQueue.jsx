import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const StatusAndQueue = () => {
  const { navTo } = useApp();
  const [currentStep, setCurrentStep] = useState(2);
  const [queuePosition, setQueuePosition] = useState(23);
  const [estimatedTime, setEstimatedTime] = useState(45);

  const steps = [
    { id: 1, title: 'Application Submitted', status: 'completed', date: '2025-08-10' },
    { id: 2, title: 'Document Verification', status: 'active', date: '2025-08-12' },
    { id: 3, title: 'Biometric Collection', status: 'pending', date: 'Pending' },
    { id: 4, title: 'Background Check', status: 'pending', date: 'Pending' },
    { id: 5, title: 'Passport Printing', status: 'pending', date: 'Pending' },
    { id: 6, title: 'Ready for Collection', status: 'pending', date: 'Pending' }
  ];

  const recentUpdates = [
    { date: '2025-08-12', time: '14:30', message: 'Document verification completed successfully' },
    { date: '2025-08-11', time: '10:15', message: 'Birth certificate verification in progress' },
    { date: '2025-08-10', time: '16:45', message: 'Application submitted and payment confirmed' }
  ];

  useEffect(() => {
    // Simulate live queue updates
    const interval = setInterval(() => {
      setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 3)));
      setEstimatedTime(prev => Math.max(5, prev - Math.floor(Math.random() * 5)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (step) => {
    if (step.id < currentStep) return 'completed';
    if (step.id === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '🔄';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <section id="status" className="content-section active">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          {/* Application Progress */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Application Progress</h3>
            <div style={{ marginTop: '1.5rem' }}>
              {steps.map((step, index) => {
                const status = getStepStatus(step);
                return (
                  <div key={step.id} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: status === 'completed' ? 'var(--success)' : 
                                   status === 'active' ? '#005A70' : '#f8f9fa',
                        color: status === 'pending' ? 'var(--muted)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        border: status === 'pending' ? '2px solid var(--card-border)' : 'none'
                      }}>
                        {getStepIcon(status)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: status === 'active' ? '#005A70' : 'var(--text)',
                          marginBottom: '0.25rem'
                        }}>
                          {step.title}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                          {step.date}
                        </div>
                      </div>
                      {status === 'active' && (
                        <div style={{
                          background: 'rgba(0, 90, 112, 0.1)',
                          color: '#005A70',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          In Progress
                        </div>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '19px',
                        top: '50px',
                        width: '2px',
                        height: '30px',
                        background: status === 'completed' ? 'var(--success)' : 'var(--card-border)'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="card">
            <h3>Recent Updates</h3>
            <div style={{ marginTop: '1rem' }}>
              {recentUpdates.map((update, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderLeft: '3px solid #005A70',
                  background: 'rgba(0, 90, 112, 0.02)',
                  marginBottom: '1rem',
                  borderRadius: '0 var(--border-radius) var(--border-radius) 0'
                }}>
                  <div style={{ minWidth: '80px', fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <div>{update.date}</div>
                    <div>{update.time}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {update.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Live Queue Status */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Live Queue Status</h3>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: '#005A70',
                marginBottom: '0.5rem'
              }}>
                #{queuePosition}
              </div>
              <div style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Your position in queue
              </div>
              <div style={{ 
                background: 'rgba(0, 90, 112, 0.1)',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem'
              }}>
                <div style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>
                  Estimated waiting time
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#005A70' 
                }}>
                  {estimatedTime} minutes
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                🔴 Live updates every 30 seconds
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Next Appointment</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Biometric Collection</div>
                <div style={{ color: 'var(--muted)' }}>Colombo Office</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📅 August 16, 2025</div>
                <div style={{ color: 'var(--muted)' }}>🕘 09:30 AM</div>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => alert('Appointment rescheduling options')}
              >
                Reschedule
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => alert('Downloading application receipt...')}
              >
                📄 Download Receipt
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => navTo('support')}
              >
                🆘 Contact Support
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => alert('Sending status update to email...')}
              >
                📧 Email Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatusAndQueue;
