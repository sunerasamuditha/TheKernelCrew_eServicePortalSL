import React, { useState, useEffect } from 'react';

const PaymentsAndBooking = () => {
  const [activeTab, setActiveTab] = useState('booking');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Mock data
  const services = [
    { id: 'passport', name: 'New Passport Application', department: 'Immigration', duration: '45 min', fee: 3500 },
    { id: 'renewal', name: 'Passport Renewal', department: 'Immigration', duration: '30 min', fee: 2800 },
    { id: 'replacement', name: 'Lost/Damaged Passport', department: 'Immigration', duration: '60 min', fee: 4200 },
    { id: 'endorsement', name: 'Passport Endorsement', department: 'Immigration', duration: '25 min', fee: 1500 }
  ];

  const locations = [
    {
      id: 'colombo',
      name: 'Immigration Office - Colombo',
      address: '41, Ananda Rajakaruna Mawatha, Colombo 10',
      phone: '+94 11 532 9000',
      hours: '8:30 AM - 4:00 PM'
    },
    {
      id: 'kandy',
      name: 'Immigration Office - Kandy',
      address: 'Temple Street, Kandy',
      phone: '+94 81 222 2037',
      hours: '8:30 AM - 4:00 PM'
    },
    {
      id: 'galle',
      name: 'Immigration Office - Galle',
      address: 'Main Street, Galle',
      phone: '+94 91 222 4567',
      hours: '8:30 AM - 4:00 PM'
    }
  ];

  const mockAiPredictions = [
    {
      date: '2024-03-15',
      score: 85,
      waitTime: '15 min',
      reason: 'Low crowd expected',
      dayOfWeek: 'Friday'
    },
    {
      date: '2024-03-18',
      score: 92,
      waitTime: '8 min',
      reason: 'Optimal time slot',
      dayOfWeek: 'Monday'
    },
    {
      date: '2024-03-20',
      score: 78,
      waitTime: '25 min',
      reason: 'Moderate crowd',
      dayOfWeek: 'Wednesday'
    }
  ];

  useEffect(() => {
    if (selectedService && selectedLocation) {
      setIsLoading(true);
      // Simulate AI prediction loading
      setTimeout(() => {
        setAiPredictions(mockAiPredictions);
        setIsLoading(false);
      }, 1500);
    }
  }, [selectedService, selectedLocation]);

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectedDate(null);
    setSelectedTime(null);
    setAiPredictions([]);
  };

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Mock available time slots
    setAvailableSlots([
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM'
    ]);
  };

  const renderServiceSelection = () => (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700' }}>
        Select Service
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service.id)}
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedService === service.id ? '2px solid #005A70' : '2px solid #f1f5f9',
              background: selectedService === service.id ? '#f0f8ff' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h4 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#212529'
              }}>
                {service.name}
              </h4>
              {selectedService === service.id && (
                <div style={{
                  background: '#005A70',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  ✓
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
              <span>📅 {service.duration}</span>
              <span>💰 LKR {service.fee.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
              {service.department}
            </div>
            {selectedService === service.id && (
              <button style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#005A70',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Selected ✓
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocationSelection = () => (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700' }}>
        Select Location
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => handleLocationSelect(location.id)}
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedLocation === location.id ? '2px solid #005A70' : '2px solid #f1f5f9',
              background: selectedLocation === location.id ? '#f0f8ff' : 'white'
            }}
          >
            <h4 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#212529'
            }}>
              {location.name}
            </h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              📍 {location.address}
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6c757d' }}>
              <span>📞 {location.phone}</span>
              <span>🕒 {location.hours}</span>
            </div>
            {selectedLocation === location.id && (
              <button style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#005A70',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Selected ✓
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAiPredictions = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        borderTop: '4px solid #005A70'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🤖</span>
          <h3 style={{ color: '#005A70', fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>
            AI Smart Scheduling
          </h3>
        </div>
        {isLoading ? (
          <p style={{ color: '#6c757d' }}>AI analyzing optimal time slots...</p>
        ) : (
          <p style={{ color: '#6c757d' }}>
            Our AI has analyzed crowd patterns and suggests the best times for your appointment.
          </p>
        )}
      </div>

      {!isLoading && aiPredictions.length > 0 && (
        <div>
          <h4 style={{ color: '#005A70', marginBottom: '1rem' }}>Recommended Dates:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {aiPredictions.map((prediction, index) => (
              <div
                key={prediction.date}
                onClick={() => handleDateSelect(prediction.date)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedDate === prediction.date ? '2px solid #005A70' : '2px solid #f1f5f9',
                  background: selectedDate === prediction.date ? '#f0f8ff' : 'white',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                  {prediction.dayOfWeek}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529', marginBottom: '0.5rem' }}>
                  {new Date(prediction.date).toLocaleDateString()}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    background: prediction.score > 85 ? '#28a745' : prediction.score > 75 ? '#ffc107' : '#17a2b8',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    {prediction.score}% optimal
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    ~{prediction.waitTime} wait
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                  {prediction.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTimeSlots = () => (
    selectedDate && availableSlots.length > 0 && (
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: '#005A70', marginBottom: '1rem' }}>Available Time Slots:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
          {availableSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: selectedTime === time ? '2px solid #005A70' : '1px solid #dee2e6',
                background: selectedTime === time ? '#005A70' : 'white',
                color: selectedTime === time ? 'white' : '#212529',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #005A70 0%, #00788C 100%)',
        color: 'white',
        borderRadius: '16px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Smart Appointment Booking
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          AI-powered scheduling for faster, smarter government service appointments
        </p>
      </div>

      {/* Booking Flow */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        {renderServiceSelection()}

        {selectedService && renderLocationSelection()}

        {selectedService && selectedLocation && renderAiPredictions()}

        {renderTimeSlots()}

        {selectedService && selectedLocation && selectedDate && selectedTime && (
          <div style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#005A70', marginBottom: '1rem' }}>Booking Summary</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Location:</strong> {locations.find(l => l.id === selectedLocation)?.name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <strong>Time:</strong> {selectedTime}
            </div>
            <button style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}>
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsAndBooking;
