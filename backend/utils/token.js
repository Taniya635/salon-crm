const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'local-development-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = signToken;
