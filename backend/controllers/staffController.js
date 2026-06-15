const Staff = require('../models/Staff');
const asyncHandler = require('../utils/asyncHandler');

const getStaff = asyncHandler(async (_req, res) => {
  const staff = await Staff.find({ active: true }).sort({ name: 1 });
  res.json(staff);
});

module.exports = { getStaff };
