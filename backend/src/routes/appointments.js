const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  createAppointment,
  getUserAppointments,
  getAppointmentDetails,
  getOfficerAppointments,
  updateAppointmentStatus,
  getAppointmentAnalytics
} = require('../controllers/appointmentsController');

// Citizen routes
router.post('/', authMiddleware, roleMiddleware(['CITIZEN']), createAppointment);
router.get('/user', authMiddleware, roleMiddleware(['CITIZEN']), getUserAppointments);
router.get('/:appointmentId', authMiddleware, roleMiddleware(['CITIZEN']), getAppointmentDetails);

// Officer routes
router.get('/officer/today', authMiddleware, roleMiddleware(['OFFICER']), getOfficerAppointments);
router.put('/:appointmentId/status', authMiddleware, roleMiddleware(['OFFICER']), updateAppointmentStatus);

// Admin routes
router.get('/analytics/data', authMiddleware, roleMiddleware(['ADMIN']), getAppointmentAnalytics);

module.exports = router;
