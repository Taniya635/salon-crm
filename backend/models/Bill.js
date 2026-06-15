const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.appointmentId = ret.appointmentId?.toString();
        ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
        delete ret._id;
        delete ret.__v;
        delete ret.updatedAt;
      }
    }
  }
);

module.exports = mongoose.model('Bill', billSchema);
