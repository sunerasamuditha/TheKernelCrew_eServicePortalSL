const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Demo users for development/testing when database is not available
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@gov.lk',
    passwordHash: '$2a$10$OEZUhjVC8mW1IUYGH10N/.YA682hiwtajuljJvpI2IpEn/DF2xsXu', // admin123
    fullName: 'System Administrator',
    nic: '751234567V',
    mobile: '+94775678901',
    role: 'ADMIN',
    department: null,
    isActive: true
  },
  {
    id: '2',
    email: 'officer@gov.lk',
    passwordHash: '$2a$10$8SH02LeemnAg/1abTJB1A.IXF/riUqWn.5ZGEwAx.9VcfKpQj6QLa', // officer123
    fullName: 'Immigration Officer',
    nic: '801234567V',
    mobile: '+94773456789',
    role: 'OFFICER',
    department: { id: '1', name: 'Immigration and Emigration', code: 'IMM' },
    isActive: true
  },
  {
    id: '3',
    email: 'citizen@gov.lk',
    passwordHash: '$2a$10$okv9WCSYZqwbllm.IcF3EOlaasMgpTwuTXHz/RwEmjlONDgNArm86', // citizen123
    fullName: 'John Citizen',
    nic: '900123456V',
    mobile: '+94771234567',
    role: 'CITIZEN',
    department: null,
    isActive: true
  }
];

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '7d' });
};

// Check if database is available
const isDatabaseAvailable = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.log('⚠️ Database not available, using demo data');
    return false;
  }
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, fullName, nic, mobile, dateOfBirth, address } = req.body;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Use database
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
    } else {
      // Use demo data
      const existingUser = DEMO_USERS.find(u => u.email === email || u.nic === nic);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'User already exists with this email or NIC' 
        });
      }

      const newUser = {
        id: String(DEMO_USERS.length + 1),
        email,
        passwordHash: await bcrypt.hash(password, 10),
        fullName,
        nic,
        mobile,
        role: 'CITIZEN',
        department: null,
        isActive: true
      };

      DEMO_USERS.push(newUser);

      const token = generateToken(newUser.id);

      res.status(201).json({
        message: 'User registered successfully (demo mode)',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbAvailable = await isDatabaseAvailable();

    console.log('🔐 Login attempt:', { email });

    let user;
    if (dbAvailable) {
      // Use database
      user = await prisma.user.findUnique({
        where: { email },
        include: { department: true }
      });
    } else {
      // Use demo data
      user = DEMO_USERS.find(u => u.email === email);
    }

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      console.log('❌ Account disabled for:', email);
      return res.status(401).json({ error: 'Account is disabled' });
    }

    const token = generateToken(user.id);

    console.log('✅ Login successful for:', email, 'Role:', user.role);

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
    const dbAvailable = await isDatabaseAvailable();
    let user;

    if (dbAvailable) {
      user = await prisma.user.findUnique({
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
    } else {
      user = DEMO_USERS.find(u => u.id === req.user.id);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
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
    } else {
      const userIndex = DEMO_USERS.findIndex(u => u.id === req.user.id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      DEMO_USERS[userIndex] = {
        ...DEMO_USERS[userIndex],
        fullName,
        mobile,
        address
      };

      res.json({
        message: 'Profile updated successfully (demo mode)',
        user: {
          id: DEMO_USERS[userIndex].id,
          email: DEMO_USERS[userIndex].email,
          fullName: DEMO_USERS[userIndex].fullName,
          role: DEMO_USERS[userIndex].role
        }
      });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  DEMO_USERS
};
