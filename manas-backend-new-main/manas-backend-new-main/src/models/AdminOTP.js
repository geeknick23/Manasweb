const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminOTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one OTP per email at a time
adminOTPSchema.index({ email: 1 }, { unique: true });

module.exports = { AdminOTP: mongoose.model('AdminOTP', adminOTPSchema) };
