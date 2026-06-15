const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401);
    throw new Error('Authentication token is required');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'local-development-secret');
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error('User no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
