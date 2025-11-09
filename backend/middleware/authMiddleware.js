const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: 'User not found for token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[authMiddleware]', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
