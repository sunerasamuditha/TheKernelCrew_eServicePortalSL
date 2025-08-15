const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/prisma');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed!'));
    }
  }
}).single('document');

// Upload document
const uploadDocument = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { appointmentId, documentType } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Verify appointment belongs to user
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          userId
        }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const document = await prisma.document.create({
        data: {
          appointmentId,
          userId,
          documentType,
          originalName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        message: 'Document uploaded successfully',
        document: {
          id: document.id,
          documentType: document.documentType,
          originalName: document.originalName,
          status: document.status,
          uploadedAt: document.uploadedAt
        }
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  });
};

// Get user documents
const getUserDocuments = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    const documents = await prisma.document.findMany({
      where: {
        appointmentId,
        userId
      },
      select: {
        id: true,
        documentType: true,
        originalName: true,
        status: true,
        verificationNotes: true,
        uploadedAt: true,
        verifiedAt: true
      },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json({ documents });
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Officer: Verify document
const verifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, verificationNotes } = req.body;

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        verificationNotes,
        verifiedAt: status !== 'PENDING' ? new Date() : null
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true
          }
        },
        appointment: {
          select: {
            appointmentNumber: true
          }
        }
      }
    });

    // Send notification (mock)
    const statusMessage = status === 'VERIFIED' ? 'verified' : 'requires attention';
    console.log(`SENDING EMAIL to ${document.user.email}: Document ${statusMessage} - ${document.documentType} for appointment ${document.appointment.appointmentNumber}`);

    res.json({
      message: 'Document verification updated successfully',
      document
    });
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  verifyDocument,
  deleteDocument
};
