const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const ServiceItem = require('../models/ServiceItem');
const asyncHandler = require('../utils/asyncHandler');

const getBills = asyncHandler(async (_req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
});

const generateBill = asyncHandler(async (req, res) => {
  const { appointmentId, discount = 0, taxRate = 0.1 } = req.body;

  if (!appointmentId) {
    res.status(400);
    throw new Error('Appointment ID is required');
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const existingBill = await Bill.findOne({ appointmentId });
  if (existingBill) {
    res.json(existingBill);
    return;
  }

  const service = await ServiceItem.findById(appointment.serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const subtotal = service.price;
  const discountAmount = Math.max(0, Number(discount) || 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * (Number(taxRate) || 0);
  const total = taxableAmount + tax;

  appointment.status = 'completed';
  await appointment.save();

  const bill = await Bill.create({
    appointmentId,
    subtotal,
    tax,
    discount: discountAmount,
    total
  });

  res.status(201).json(bill);
});

module.exports = { getBills, generateBill };
