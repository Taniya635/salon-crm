const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
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

module.exports = mongoose.model('Staff', staffSchema);
