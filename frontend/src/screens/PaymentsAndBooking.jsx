import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const PaymentsAndBooking = () => {
  const { navTo } = useApp();
  const [selectedService, setSelectedService] = useState('standard');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const services = [
    { id: 'standard', name: 'Standard Processing', fee: 'LKR 5,000', duration: '21 working days' },
    { id: 'express', name: 'Express Processing', fee: 'LKR 10,000', duration: '10 working days' },
    { id: 'urgent', name: 'Urgent Processing', fee: 'LKR 15,000', duration: '5 working days' }
  ];

  const offices = [
    { id: 'colombo', name: 'Colombo Office', address: 'Battaramulla', waitTime: 'Low wait (15-30 min)' },
    { id: 'kandy', name: 'Kandy Office', address: 'Kandy Central', waitTime: 'Medium wait (30-45 min)' },
    { id: 'galle', name: 'Galle Office', address: 'Galle Fort', waitTime: 'High wait (45-60 min)' }
  ];

  const availableDates = [
    '2025-08-16', '2025-08-17', '2025-08-18', '2025-08-19', '2025-08-20'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handlePayment = () => {
    if (!selectedOffice || !selectedDate || !selectedTime) {
      alert('Please complete your appointment booking first.');
      return;
    }
    
    const selectedServiceData = services.find(s => s.id === selectedService);
    alert(`Payment of ${selectedServiceData.fee} initiated via ${paymentMethod}. Booking confirmed for ${selectedDate} at ${selectedTime}.`);
    navTo('status');
  };

  return (
    <section id="payments" className="content-section active">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          {/* Service Selection */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Select Service Type</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {services.map(service => (
                <label key={service.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${selectedService === service.id ? 'var(--peacock)' : 'var(--card-border)'}`,
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  background: selectedService === service.id ? 'rgba(0, 90, 112, 0.05)' : 'transparent'
                }}>
                  <input 
                    type="radio" 
                    name="service" 
                    value={service.id}
                    checked={selectedService === service.id}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={{ marginRight: '1rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{service.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{service.duration}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--peacock)', fontSize: '1.1rem' }}>
                    {service.fee}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Office Selection */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Select Office Location</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {offices.map(office => (
                <label key={office.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${selectedOffice === office.id ? 'var(--peacock)' : 'var(--card-border)'}`,
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  background: selectedOffice === office.id ? 'rgba(0, 90, 112, 0.05)' : 'transparent'
                }}>
                  <input 
                    type="radio" 
                    name="office" 
                    value={office.id}
                    checked={selectedOffice === office.id}
                    onChange={(e) => setSelectedOffice(e.target.value)}
                    style={{ marginRight: '1rem' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{office.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{office.address}</div>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: office.waitTime.includes('Low') ? 'rgba(40, 167, 69, 0.1)' : 
                               office.waitTime.includes('Medium') ? 'rgba(255, 193, 7, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    color: office.waitTime.includes('Low') ? 'var(--success)' : 
                           office.waitTime.includes('Medium') ? '#856404' : 'var(--error)'
                  }}>
                    {office.waitTime}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="card">
            <h3>Select Appointment Date & Time</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date</label>
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--card-border)' }}
                >
                  <option value="">Select date</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Time</label>
                <select 
                  value={selectedTime} 
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--card-border)' }}
                  disabled={!selectedDate}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <div className="card">
            <h3>Payment Summary</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Service Fee:</span>
                <span style={{ fontWeight: 600 }}>
                  {services.find(s => s.id === selectedService)?.fee || 'LKR 5,000'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Processing Fee:</span>
                <span>LKR 500</span>
              </div>
              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--card-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--peacock)' }}>
                  {selectedService === 'standard' ? 'LKR 5,500' : 
                   selectedService === 'express' ? 'LKR 10,500' : 'LKR 15,500'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h4>Payment Method</h4>
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  💳 Credit/Debit Card
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  🏦 Online Banking
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  📱 Mobile Payment
                </label>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={handlePayment}
            >
              Pay & Book Appointment
            </button>
          </div>

          {selectedOffice && selectedDate && selectedTime && (
            <div className="card" style={{ marginTop: '1rem', background: 'rgba(40, 167, 69, 0.05)', borderColor: 'var(--success)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>Booking Summary</h4>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <div><strong>Office:</strong> {offices.find(o => o.id === selectedOffice)?.name}</div>
                <div><strong>Date:</strong> {selectedDate}</div>
                <div><strong>Time:</strong> {selectedTime}</div>
                <div><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentsAndBooking;
