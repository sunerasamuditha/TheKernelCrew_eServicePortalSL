const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { DEMO_USERS } = require('../controllers/authController');

// Check if database is available
const isDatabaseAvailable = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    return false;
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const dbAvailable = await isDatabaseAvailable();
    
    let user;
    if (dbAvailable) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { department: true }
      });
    } else {
      user = DEMO_USERS.find(u => u.id === decoded.userId);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or user not active.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
