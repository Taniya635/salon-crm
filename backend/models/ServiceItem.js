const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

module.exports = mongoose.model('ServiceItem', serviceItemSchema);
