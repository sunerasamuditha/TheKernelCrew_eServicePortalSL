const express = require('express');
const router = express.Router();

// Mock appointments data
const mockAppointments = [
  {
    id: 'APT001',
    applicationId: 'APP001',
    office: 'colombo',
    date: '2025-08-16',
    time: '09:30',
    type: 'biometric',
    status: 'confirmed'
  }
];

// Available time slots
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '14:00', '14:30', '15:00', '15:30', '16:00'
];

// Get available slots
router.get('/available/:office/:date', (req, res) => {
  const { office, date } = req.params;
  
  // Mock availability - some slots are taken
  const bookedSlots = mockAppointments
    .filter(apt => apt.office === office && apt.date === date)
    .map(apt => apt.time);
  
  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
  
  res.json({
    success: true,
    office,
    date,
    availableSlots,
    totalSlots: timeSlots.length,
    availableCount: availableSlots.length
  });
});

// Book appointment
router.post('/', (req, res) => {
  const { applicationId, office, date, time, type } = req.body;
  
  // Check if slot is available
  const existingAppointment = mockAppointments.find(
    apt => apt.office === office && apt.date === date && apt.time === time
  );
  
  if (existingAppointment) {
    return res.status(400).json({
      success: false,
      message: 'Time slot is already booked'
    });
  }
  
  const appointment = {
    id: `APT${Date.now()}`,
    applicationId,
    office,
    date,
    time,
    type: type || 'biometric',
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  };
  
  mockAppointments.push(appointment);
  
  res.json({
    success: true,
    message: 'Appointment booked successfully',
    appointment
  });
});

// Get user appointments
router.get('/user/:userId', (req, res) => {
  // Mock user appointments
  res.json({
    success: true,
    appointments: mockAppointments
  });
});

// Cancel appointment
router.delete('/:appointmentId', (req, res) => {
  const appointmentIndex = mockAppointments.findIndex(
    apt => apt.id === req.params.appointmentId
  );
  
  if (appointmentIndex !== -1) {
    mockAppointments[appointmentIndex].status = 'cancelled';
    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }
});

// Reschedule appointment
router.put('/:appointmentId', (req, res) => {
  const { date, time } = req.body;
  const appointmentIndex = mockAppointments.findIndex(
    apt => apt.id === req.params.appointmentId
  );
  
  if (appointmentIndex !== -1) {
    mockAppointments[appointmentIndex] = {
      ...mockAppointments[appointmentIndex],
      date,
      time,
      status: 'rescheduled'
    };
    
    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: mockAppointments[appointmentIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }
});

module.exports = router;
