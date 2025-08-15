const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, fullName, nic, mobile, dateOfBirth, address } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { nic }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or NIC' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        nic,
        mobile,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        role: 'CITIZEN'
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is disabled' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { department: true },
      select: {
        id: true,
        email: true,
        fullName: true,
        nic: true,
        mobile: true,
        dateOfBirth: true,
        address: true,
        role: true,
        department: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile, address } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        fullName,
        mobile,
        address
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        nic: true,
        mobile: true,
        dateOfBirth: true,
        address: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
