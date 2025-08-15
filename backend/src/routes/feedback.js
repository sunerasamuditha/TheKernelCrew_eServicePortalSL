const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  submitFeedback,
  getUserFeedback,
  getAllFeedback
} = require('../controllers/feedbackController');

// Citizen routes
router.post('/', authMiddleware, roleMiddleware(['CITIZEN']), submitFeedback);
router.get('/user', authMiddleware, roleMiddleware(['CITIZEN']), getUserFeedback);

// Admin routes
router.get('/all', authMiddleware, roleMiddleware(['ADMIN']), getAllFeedback);

module.exports = router;
