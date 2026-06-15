const express = require('express');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', protect, createAppointment);
router.patch('/:id', protect, updateAppointment);
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;
