const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  uploadDocument,
  getUserDocuments,
  verifyDocument,
  deleteDocument
} = require('../controllers/documentsController');

// Citizen routes
router.post('/upload', authMiddleware, roleMiddleware(['CITIZEN']), uploadDocument);
router.get('/appointment/:appointmentId', authMiddleware, roleMiddleware(['CITIZEN']), getUserDocuments);
router.delete('/:documentId', authMiddleware, roleMiddleware(['CITIZEN']), deleteDocument);

// Officer routes
router.put('/:documentId/verify', authMiddleware, roleMiddleware(['OFFICER']), verifyDocument);

module.exports = router;
