const express = require('express');
const router = express.Router();

// Mock authentication routes
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication logic
  if (email && password) {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 1,
        email: email,
        name: 'Anura Perera',
        nic: '900123456V'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
});

router.post('/register', (req, res) => {
  const { name, email, password, nic } = req.body;
  
  // Mock registration logic
  res.json({
    success: true,
    message: 'Registration successful',
    user: {
      id: Date.now(),
      name,
      email,
      nic
    }
  });
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
