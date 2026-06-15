const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const ServiceItem = require('../models/ServiceItem');
const asyncHandler = require('../utils/asyncHandler');

async function assertBookable({ staffId, serviceId, date, time, excludeAppointmentId }) {
  const [staff, service] = await Promise.all([
    Staff.findById(staffId),
    ServiceItem.findById(serviceId)
  ]);

  if (!staff) {
    const error = new Error('Staff member not found');
    error.statusCode = 404;
    throw error;
  }

  if (!service) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }

  const conflictQuery = {
    staffId,
    date,
    time,
    status: { $ne: 'cancelled' }
  };

  if (excludeAppointmentId) {
    conflictQuery._id = { $ne: excludeAppointmentId };
  }

  const conflict = await Appointment.findOne(conflictQuery);

  if (conflict) {
    const error = new Error('That staff member already has an appointment at this time');
    error.statusCode = 409;
    throw error;
  }
}

const getAppointments = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.date) query.date = req.query.date;
  if (req.query.status) query.status = req.query.status;

  const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
  res.json(appointments);
});

const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.json(appointment);
});

const createAppointment = asyncHandler(async (req, res) => {
  const { clientName, clientPhone, staffId, serviceId, date, time, notes } = req.body;

  if (!clientName || !clientPhone || !staffId || !serviceId || !date || !time) {
    res.status(400);
    throw new Error('Client, staff, service, date, and time are required');
  }

  await assertBookable({ staffId, serviceId, date, time });

  const appointment = await Appointment.create({
    clientId: req.body.clientId || `c${Date.now()}`,
    clientName,
    clientPhone,
    staffId,
    serviceId,
    date,
    time,
    notes: notes || '',
    status: 'booked'
  });

  res.status(201).json(appointment);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const nextStaffId = req.body.staffId || appointment.staffId;
  const nextServiceId = req.body.serviceId || appointment.serviceId;
  const nextDate = req.body.date || appointment.date;
  const nextTime = req.body.time || appointment.time;

  if (req.body.status && !['booked', 'completed', 'cancelled'].includes(req.body.status)) {
    res.status(400);
    throw new Error('Invalid appointment status');
  }

  if (
    String(nextStaffId) !== String(appointment.staffId) ||
    String(nextServiceId) !== String(appointment.serviceId) ||
    nextDate !== appointment.date ||
    nextTime !== appointment.time
  ) {
    await assertBookable({
      staffId: nextStaffId,
      serviceId: nextServiceId,
      date: nextDate,
      time: nextTime,
      excludeAppointmentId: appointment.id
    });
  }

  const allowedFields = [
    'clientName',
    'clientPhone',
    'staffId',
    'serviceId',
    'date',
    'time',
    'status',
    'notes'
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) appointment[field] = req.body[field];
  });

  const updated = await appointment.save();
  res.json(updated);
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = 'cancelled';
  res.json(await appointment.save());
});

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment
};
