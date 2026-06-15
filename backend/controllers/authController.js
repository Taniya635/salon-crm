const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const signToken = require('../utils/token');

const login = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    res.status(400);
    throw new Error('User ID and password are required');
  }

  const user = await User.findOne({ username: userId.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid User ID or password');
  }

  res.json({
    token: signToken(user),
    user: user.toJSON()
  });
});

const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const register = asyncHandler(async (req, res) => {
  const { userId, password, role } = req.body;

  if (!userId || !password) {
    res.status(400);
    throw new Error('User ID and password are required');
  }

  const userExists = await User.findOne({ username: userId.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const userRole = role === 'admin' ? 'admin' : 'client';

  const user = await User.create({
    username: userId.toLowerCase(),
    password,
    role: userRole
  });

  if (user) {
    res.status(201).json({
      token: signToken(user),
      user: user.toJSON()
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports = { login, me, register };
