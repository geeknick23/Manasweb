const mongoose = require('mongoose');

const passwordResetOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired OTPs (TTL index)
passwordResetOTPSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

// Index for quick lookup by email
passwordResetOTPSchema.index({ email: 1 });

const PasswordResetOTP = mongoose.model('PasswordResetOTP', passwordResetOTPSchema);

module.exports = { PasswordResetOTP };
