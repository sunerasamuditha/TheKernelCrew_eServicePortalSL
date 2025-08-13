const express = require('express');
const router = express.Router();

// Mock payments data
const mockPayments = [];

// Process payment
router.post('/', (req, res) => {
  const { applicationId, amount, method, serviceType } = req.body;
  
  const payment = {
    id: `PAY${Date.now()}`,
    applicationId,
    amount,
    method,
    serviceType,
    status: 'completed',
    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString()
  };
  
  mockPayments.push(payment);
  
  res.json({
    success: true,
    message: 'Payment processed successfully',
    payment
  });
});

// Get payment history
router.get('/history/:userId', (req, res) => {
  // Mock payment history
  const payments = mockPayments.filter(payment => 
    payment.applicationId.includes('APP') // Simple mock filter
  );
  
  res.json({
    success: true,
    payments
  });
});

// Get payment by ID
router.get('/:paymentId', (req, res) => {
  const payment = mockPayments.find(payment => payment.id === req.params.paymentId);
  
  if (payment) {
    res.json({
      success: true,
      payment
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
});

module.exports = router;
