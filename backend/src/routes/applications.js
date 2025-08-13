const express = require('express');
const router = express.Router();

// Mock applications data
const mockApplications = [
  {
    id: 'APP001',
    userId: 1,
    status: 'submitted',
    currentStep: 2,
    submittedDate: '2025-08-10',
    personalInfo: {
      name: 'Anura Perera',
      nic: '900123456V',
      dob: '1990-12-05',
      address: 'No.7, Galle Road, Colombo'
    }
  }
];

// Get user applications
router.get('/', (req, res) => {
  res.json({
    success: true,
    applications: mockApplications
  });
});

// Create new application
router.post('/', (req, res) => {
  const { personalInfo, serviceType } = req.body;
  
  const newApplication = {
    id: `APP${Date.now()}`,
    userId: 1,
    status: 'submitted',
    currentStep: 1,
    submittedDate: new Date().toISOString().split('T')[0],
    personalInfo,
    serviceType
  };
  
  mockApplications.push(newApplication);
  
  res.json({
    success: true,
    message: 'Application submitted successfully',
    application: newApplication
  });
});

// Get application by ID
router.get('/:id', (req, res) => {
  const application = mockApplications.find(app => app.id === req.params.id);
  
  if (application) {
    res.json({
      success: true,
      application
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }
});

// Update application
router.put('/:id', (req, res) => {
  const applicationIndex = mockApplications.findIndex(app => app.id === req.params.id);
  
  if (applicationIndex !== -1) {
    mockApplications[applicationIndex] = {
      ...mockApplications[applicationIndex],
      ...req.body
    };
    
    res.json({
      success: true,
      message: 'Application updated successfully',
      application: mockApplications[applicationIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }
});

module.exports = router;
