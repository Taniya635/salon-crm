const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    clientPhone: { type: String, required: true, trim: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceItem', required: true },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format']
    },
    time: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, 'Time must use HH:mm format']
    },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked'
    },
    notes: { type: String, trim: true, default: '' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.staffId = ret.staffId?.toString();
        ret.serviceId = ret.serviceId?.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

appointmentSchema.index({ staffId: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
