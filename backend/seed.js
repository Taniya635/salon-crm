const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seedDatabase = require('./services/seedDatabase');

async function run() {
  await connectDB();
  await seedDatabase({ force: process.argv.includes('--force') });
  await mongoose.disconnect();
  console.log('Seed data is ready');
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
