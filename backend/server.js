const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const seedDatabase = require('./services/seedDatabase');
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const billRoutes = require('./routes/billRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'salon-crm-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bills', billRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();

  if (process.env.AUTO_SEED !== 'false') {
    await seedDatabase();
  }

  app.listen(port, () => {
    console.log(`Salon CRM API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
