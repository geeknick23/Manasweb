const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { OTP } = require('../models/OTP.js');
const { PasswordResetOTP } = require('../models/PasswordResetOTP.js');
const { sendOTPEmail, sendPasswordResetOTPEmail } = require('../services/emailService.js');
const smsService = require('../services/smsService.js');
const { formatPhone } = require('../services/smsService.js');
const { registerSchema, loginSchema, verifyOTPSchema } = require('../validations/auth.js');
const { uploadImage, isBase64DataUrl } = require('../services/cloudinaryService.js');

// Normalize phone to 10-digit local format for consistent DB storage & lookup
const normalizePhone = (phone) => {
  if (!phone) return phone;
  let p = String(phone).replace(/[\s\-\+]/g, '');
  // Strip leading 91 country code to get 10-digit number
  if (p.length === 12 && p.startsWith('91')) p = p.slice(2);
  if (p.length === 11 && p.startsWith('0')) p = p.slice(1);
  return p;
};

// Register new user
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      profile_photo,
      date_of_birth,
      gender,
      marital_status,
      education,
      profession,
      phone_number,
      interests_hobbies,
      brief_personal_description,
      location,
      guardian,
      caste,
      religion,
      divorce_finalized,
      children,
      children_count
    } = req.body;

    console.log('Registration attempt for:', email || phone_number);

    // Normalize email
    const normalizedEmail = (email && email.trim() !== '') ? email.toLowerCase().trim() : undefined;

    // Check if user already exists
    if (normalizedEmail) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already registered'
        });
      }
    }

    const normalizedPhone = normalizePhone(phone_number);
    const existingPhone = await User.findOne({ phone_number: normalizedPhone });
    if (existingPhone) {
      return res.status(400).json({
        message: 'Phone number already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload profile photo to Cloudinary if provided
    let cloudinaryPhotoUrl = null;
    if (profile_photo && isBase64DataUrl(profile_photo)) {
      try {
        // Use email hash as temp ID since we don't have user ID yet
        const tempId = Buffer.from(email).toString('base64').slice(0, 20);
        console.log('Attempting to upload profile photo to Cloudinary...');
        const result = await uploadImage(profile_photo, 'profile_photos', `temp_${tempId}`);
        cloudinaryPhotoUrl = result.url;
        console.log('Profile photo uploaded successfully');
      } catch (uploadError) {
        console.error('Failed to upload profile photo during registration:', uploadError);
        // Continue registration without photo rather than failing
      }
    } else if (profile_photo) {
      console.log('Profile photo provided but not in expected format');
    }

    // Create new user
    const user = new User({
      full_name,
      email: normalizedEmail,
      password: hashedPassword,
      profile_photo: cloudinaryPhotoUrl,
      has_profile_photo: !!cloudinaryPhotoUrl,
      date_of_birth: new Date(date_of_birth),
      gender,
      marital_status,
      education,
      profession,
      phone_number: normalizePhone(phone_number),
      interests_hobbies,
      brief_personal_description,
      location,
      guardian,
      caste,
      religion,
      divorce_finalized,
      children,
      children_count,
      is_verified: false
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    // Send OTP based on verification method
    const method = req.body.verification_method;

    // Use the normalized phone that was saved to DB

    try {
      if (method === 'sms' || (!method && !email)) {
        // SMS: MSG91 generates and delivers the OTP (no MongoDB storage needed)
        await smsService.sendOTP(normalizedPhone);
        console.log('OTP sent via MSG91 SMS');
        res.status(201).json({
          message: 'Registration successful. Please check your phone for verification code.',
          userId: user._id,
          phone_number: user.phone_number,
          verification_method: 'sms'
        });
      } else {
        // Email: We generate OTP and store in MongoDB
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const otpDoc = new OTP({ userId: user._id, otp, expiry: otpExpiry });
        await otpDoc.save();

        await sendOTPEmail(normalizedEmail, otp);
        console.log('OTP email sent successfully');
        res.status(201).json({
          message: 'Registration successful. Please check your email for verification code.',
          userId: user._id,
          email: user.email,
          verification_method: 'email'
        });
      }
    } catch (msgError) {
      console.error('Failed to send OTP message:', msgError);
      console.log('Registration successful but messaging service failed. User ID:', user._id);
      res.status(201).json({
        message: 'Registration successful! Please contact support for verification.',
        userId: user._id,
        email: user.email,
        note: 'Verification will be handled by support team'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      // Duplicate key error
      // Assuming email is the only unique field now for user identification at registration
      return res.status(400).json({
        message: 'Email or Phone already exists'
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;

    // Check if user exists (only by email now)
    const user = await User.findOne({
      email: username_or_email.toLowerCase().trim()
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Remove username from payload
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        marital_status: user.marital_status,
        education: user.education,
        profession: user.profession,
        phone_number: user.phone_number,
        interests_hobbies: user.interests_hobbies,
        brief_personal_description: user.brief_personal_description,
        location: user.location,
        children_count: user.children_count,
        profile_photo: user.profile_photo,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP (Email or Phone)
const verifyOTP = async (req, res) => {
  try {
    const { email, phone_number, code } = req.body;

    if (!email && !phone_number) {
      return res.status(400).json({ message: 'Email or Phone is required' });
    }

    const query = email ? { email: email.toLowerCase().trim() } : { phone_number: normalizePhone(phone_number) };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (phone_number && !email) {
      // Phone-based: Verify via MSG91's OTP API
      try {
        await smsService.verifyOTP(phone_number, code);
      } catch (err) {
        return res.status(400).json({ message: err.message || 'Invalid or expired OTP' });
      }
    } else {
      // Email-based: Verify from MongoDB
      const otpDoc = await OTP.findOne({
        userId: user._id,
        otp: code,
        expiry: { $gt: new Date() }
      });

      if (!otpDoc) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      await OTP.deleteOne({ _id: otpDoc._id });
    }

    // Update user verification status
    user.is_verified = true;
    await user.save();

    res.json({ message: 'Verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Initiate SMS Login — MSG91 generates and sends OTP
const initiateSmsLogin = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const normalized = normalizePhone(phone_number);
    const user = await User.findOne({ phone_number: normalized });
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not registered. Please register first.' });
    }

    try {
      await smsService.sendOTP(normalized);
      res.json({ message: 'OTP sent via SMS' });
    } catch (err) {
      console.error('SMS Send Error:', err);
      return res.status(500).json({ message: 'Failed to send SMS OTP. Please try again.' });
    }

  } catch (error) {
    console.error('Initiate SMS Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify SMS Login — MSG91 verifies the OTP
const verifySmsLogin = async (req, res) => {
  try {
    const { phone_number, code } = req.body;

    if (!phone_number || !code) {
      return res.status(400).json({ message: 'Phone number and code are required' });
    }

    const normalized = normalizePhone(phone_number);
    const user = await User.findOne({ phone_number: normalized });
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not registered. Please register first.' });
    }

    // Verify OTP via MSG91
    try {
      await smsService.verifyOTP(normalized, code);
    } catch (err) {
      return res.status(400).json({ message: err.message || 'Invalid or expired OTP' });
    }

    // Update user verification status
    if (!user.is_verified) {
      user.is_verified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        is_verified: user.is_verified,
      }
    });
  } catch (error) {
    console.error('Verify SMS Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, phone_number } = req.body;

    if (!email && !phone_number) return res.status(400).json({ message: 'Email or Phone is required' });

    // Normalize phone for DB lookup (matches how it was stored at registration)
    const normalizedPhone = phone_number ? normalizePhone(phone_number) : null;
    const query = email ? { email: email.toLowerCase().trim() } : { phone_number: normalizedPhone };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (phone_number && !email) {
      // Phone-based: Use MSG91's resend API (pass normalized phone)
      await smsService.resendOTP(normalizedPhone);
    } else {
      // Email-based: Generate new OTP and store in MongoDB
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await OTP.deleteMany({ userId: user._id });
      const otpDoc = new OTP({ userId: user._id, otp, expiry: otpExpiry });
      await otpDoc.save();
      await sendOTPEmail(email.toLowerCase().trim(), otp);
    }

    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { profile_photo } = req.body;
    const userId = req.user.userId;

    if (!profile_photo) {
      return res.status(400).json({ error: 'Profile photo is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profile_photo },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile_photo: user.profile_photo });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

// Request password reset - sends OTP to email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.json({ message: 'If an account exists with this email, you will receive a password reset OTP' });
    }

    // Delete any existing password reset OTPs for this email
    await PasswordResetOTP.deleteMany({ email: user.email });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    const otpDoc = new PasswordResetOTP({
      email: user.email,
      otp,
      expiry: otpExpiry
    });
    await otpDoc.save();

    // Send OTP email
    try {
      await sendPasswordResetOTPEmail(user.email, otp);
    } catch (emailError) {
      console.error('Failed to send password reset OTP email:', emailError);
      return res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
    }

    res.json({ message: 'If an account exists with this email, you will receive a password reset OTP' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find the OTP document
    const otpDoc = await PasswordResetOTP.findOne({
      email: normalizedEmail,
      expiry: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
    }

    // Check attempts (max 5)
    if (otpDoc.attempts >= 5) {
      await PasswordResetOTP.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await PasswordResetOTP.deleteOne({ _id: otpDoc._id });

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
  initiateSmsLogin,
  verifySmsLogin
};
