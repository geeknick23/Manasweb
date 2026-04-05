const express = require('express');
const { register, login, verifyOTP, resendOTP, forgotPassword, resetPassword, initiateSmsLogin, verifySmsLogin } = require('../controllers/authController.js');
const { validateRegistration, validateLogin, validateOTP } = require('../validations/auth.js');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter.js');

const router = express.Router();

// Apply rate limiting to auth endpoints
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/verify-otp', authLimiter, validateOTP, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);

// Password reset endpoints
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// SMS OTP Auth endpoints
router.post('/sms/login', otpLimiter, initiateSmsLogin);
router.post('/sms/verify', authLimiter, verifySmsLogin);

module.exports = router;
