const User = require('../models/User');
const Staff = require('../models/Staff');
const ServiceItem = require('../models/ServiceItem');
const { staff, services } = require('../data/seedData');

async function seedDatabase({ force = false } = {}) {
  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Staff.deleteMany({}),
      ServiceItem.deleteMany({})
    ]);
  }

  const [userCount, staffCount, serviceCount] = await Promise.all([
    User.countDocuments(),
    Staff.countDocuments(),
    ServiceItem.countDocuments()
  ]);

  if (userCount === 0) {
    await User.create({
      username: process.env.ADMIN_USER_ID || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
  }

  if (staffCount === 0) {
    await Staff.insertMany(staff);
  }

  if (serviceCount === 0) {
    await ServiceItem.insertMany(services);
  }
}

module.exports = seedDatabase;
