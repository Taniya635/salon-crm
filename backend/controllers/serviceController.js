const ServiceItem = require('../models/ServiceItem');
const asyncHandler = require('../utils/asyncHandler');

const getServices = asyncHandler(async (_req, res) => {
  const services = await ServiceItem.find({ active: true }).sort({ name: 1 });
  res.json(services);
});

module.exports = { getServices };
