const nodemailer = require('nodemailer');

// Helper to escape HTML to prevent injection
const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
};

const createTransporter = async () => {
  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration missing. Set SMTP_USER and SMTP_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
    // TLS verification enabled by default (secure)
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification OTP - Manas Foundation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${escapeHtml(otp)}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send verification email');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = await createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request - Manas Foundation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${escapeHtml(resetUrl)}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw new Error('Failed to send password reset email');
  }
};

// Send OTP for password reset (mobile app)
const sendPasswordResetOTPEmail = async (email, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset OTP - Manas Foundation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>You have requested to reset your password. Use the OTP below to proceed:</p>
        <h1 style="color: #6B4EAD; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${escapeHtml(otp)}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #e53935;"><strong>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset OTP email:', error.message);
    throw new Error('Failed to send password reset OTP email');
  }
};

const sendInterestMatchEmail = async (user1, user2) => {
  const transporter = await createTransporter();

  // Helper to format location
  const formatLocation = (loc) => {
    if (!loc) return '';
    const parts = [loc.village, loc.tehsil, loc.district, loc.state].filter(Boolean);
    return escapeHtml(parts.join(', '));
  };

  // Email for user1
  const mailOptions1 = {
    from: process.env.SMTP_USER,
    to: user1.email,
    subject: 'Interest Match - Contact Information',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎉 Interest Match!</h2>
        <p>Great news! Your interest in <strong>${escapeHtml(user2.full_name)}</strong> has been accepted!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${escapeHtml(user2.full_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(user2.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(user2.phone_number)}</p>
          <p><strong>Date of Birth:</strong> ${user2.date_of_birth ? new Date(user2.date_of_birth).toLocaleDateString() : ''}</p>
          <p><strong>Location:</strong> ${formatLocation(user2.location)}</p>
          <p><strong>Profession:</strong> ${escapeHtml(user2.profession)}</p>
          ${user2.guardian && user2.guardian.name ? `<p><strong>Guardian Name:</strong> ${escapeHtml(user2.guardian.name)}</p>` : ''}
          ${user2.guardian && user2.guardian.contact ? `<p><strong>Guardian Contact:</strong> ${escapeHtml(user2.guardian.contact)}</p>` : ''}
        </div>
        
        <p>You can now contact them directly to take your relationship forward!</p>
        <p>Best wishes,<br>The Manas Team</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  // Email for user2
  const mailOptions2 = {
    from: process.env.SMTP_USER,
    to: user2.email,
    subject: 'Interest Match - Contact Information',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎉 Interest Match!</h2>
        <p>Great news! You have accepted <strong>${escapeHtml(user1.full_name)}</strong>'s interest in your profile!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${escapeHtml(user1.full_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(user1.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(user1.phone_number)}</p>
          <p><strong>Date of Birth:</strong> ${user1.date_of_birth ? new Date(user1.date_of_birth).toLocaleDateString() : ''}</p>
          <p><strong>Location:</strong> ${formatLocation(user1.location)}</p>
          <p><strong>Profession:</strong> ${escapeHtml(user1.profession)}</p>
          ${user1.guardian && user1.guardian.name ? `<p><strong>Guardian Name:</strong> ${escapeHtml(user1.guardian.name)}</p>` : ''}
          ${user1.guardian && user1.guardian.contact ? `<p><strong>Guardian Contact:</strong> ${escapeHtml(user1.guardian.contact)}</p>` : ''}
        </div>
        
        <p>You can now contact them directly to take your relationship forward!</p>
        <p>Best wishes,<br>The Manas Team</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions1);
    await transporter.sendMail(mailOptions2);
  } catch (error) {
    console.error('Error sending interest match emails:', error.message);
    throw new Error('Failed to send interest match emails');
  }
};

const sendContactMail = async ({ name, email, subject, message }) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `Contact Form: ${escapeHtml(subject)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px;">${escapeHtml(message)}</div>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact mail:', error.message);
    throw new Error('Failed to send contact mail');
  }
};

// Privacy-respecting message notification - doesn't include message content
const sendNewMessageEmail = async (senderName, receiverEmail, content) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: receiverEmail,
    subject: `New Message from ${escapeHtml(senderName)} - Manas Foundation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Message</h2>
        <p>You have received a new message from <strong>${escapeHtml(senderName)}</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://manasfoundation.co.in'}/login" 
             style="background-color: #6B4EAD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Open App to Read
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">For your privacy, message content is not included in emails.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending new message email:', error.message);
    // Don't throw, just log, so chat flow isn't interrupted
  }
};

const sendInterestReceivedEmail = async (senderName, receiverEmail) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: receiverEmail,
    subject: `New Interest Received - Manas Foundation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Interest Received!</h2>
        <p><strong>${escapeHtml(senderName)}</strong> has expressed interest in your profile.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://manasfoundation.co.in'}/login" 
             style="background-color: #6B4EAD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Profile & Respond
          </a>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending interest received email:', error.message);
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendPasswordResetOTPEmail,
  sendInterestMatchEmail,
  sendContactMail,
  sendNewMessageEmail,
  sendInterestReceivedEmail
};
