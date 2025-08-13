const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Mock documents data
const mockDocuments = [
  {
    id: 'DOC001',
    applicationId: 'APP001',
    name: 'Birth Certificate',
    type: 'birth-cert',
    status: 'verified',
    uploadDate: '2025-08-10',
    size: '2.1 MB'
  }
];

// Get documents for application
router.get('/:applicationId', (req, res) => {
  const documents = mockDocuments.filter(doc => doc.applicationId === req.params.applicationId);
  
  res.json({
    success: true,
    documents
  });
});

// Upload document
router.post('/:applicationId/upload', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  const newDocument = {
    id: `DOC${Date.now()}`,
    applicationId: req.params.applicationId,
    name: req.file.originalname,
    type: req.body.type || 'other',
    status: 'pending',
    uploadDate: new Date().toISOString().split('T')[0],
    size: `${(req.file.size / 1024 / 1024).toFixed(1)} MB`
  };
  
  mockDocuments.push(newDocument);
  
  res.json({
    success: true,
    message: 'Document uploaded successfully',
    document: newDocument
  });
});

// Delete document
router.delete('/:documentId', (req, res) => {
  const documentIndex = mockDocuments.findIndex(doc => doc.id === req.params.documentId);
  
  if (documentIndex !== -1) {
    mockDocuments.splice(documentIndex, 1);
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Document not found'
    });
  }
});

module.exports = router;
