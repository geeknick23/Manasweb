const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { ImpactCard } = require('../models/ImpactCard.js');
const { AchievementCard } = require('../models/AchievementCard.js');
const { SuccessStory } = require('../models/SuccessStory.js');
const { MediaCard } = require('../models/MediaCard.js');
const { AdminUser } = require('../models/AdminUser.js');
const { AdminOTP } = require('../models/AdminOTP.js');
const { Event } = require('../models/Event.js');
const { Program } = require('../models/Program.js');
const { Project } = require('../models/Project.js');
const { ContactInfo } = require('../models/ContactInfo.js');
const { DonateInfo } = require('../models/DonateInfo.js');
const { Milestone } = require('../models/Milestone.js');
const { VolunteerRole } = require('../models/VolunteerRole.js');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'manasfoundation2025@gmail.com';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const createTransporter = async () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendAdminOTP = async (req, res) => {
  const { email } = req.body;
  let allowed = false;
  if (email === ADMIN_EMAIL) {
    allowed = true;
  } else {
    const admin = await AdminUser.findOne({ email });
    if (admin) allowed = true;
  }
  if (!allowed) {
    return res.status(403).json({ message: 'Unauthorized email' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    // Store OTP in database (upsert - replace if exists)
    await AdminOTP.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS)
      },
      { upsert: true, new: true }
    );

    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Admin OTP - Manas Foundation',
      html: `<h2>Your OTP is: <span style="color:#4F46E5">${otp}</span></h2><p>This OTP is valid for 10 minutes.</p>`
    });
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending admin OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyAdminOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await AdminOTP.findOne({ email });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > record.expiresAt) {
      await AdminOTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Delete OTP after successful verification
    await AdminOTP.deleteOne({ email });

    let admin = await AdminUser.findOne({ email });
    if (!admin && email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admin not found' });
    }

    // If admin is not in DB but matches ADMIN_EMAIL, create a dummy admin object for token
    if (!admin && email === ADMIN_EMAIL) {
      admin = { _id: 'primary-admin', email: ADMIN_EMAIL };
    }

    // Generate JWT token with 5-hour expiry, including userId
    const token = jwt.sign(
      {
        userId: admin._id,
        email: email,
        role: 'admin',
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    res.json({
      message: 'OTP verified',
      token: token,
      expiresIn: '5h'
    });
  } catch (error) {
    console.error('Error verifying admin OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// ===== USER MANAGEMENT =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { full_name, email, age, gender, marital_status, education, profession, phone_number, interests_hobbies, brief_personal_description, location, children_count, is_verified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email,
        age,
        gender,
        marital_status,
        education,
        profession,
        phone_number,
        interests_hobbies,
        brief_personal_description,
        location,
        children_count,
        is_verified
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ===== IMPACT CARDS MANAGEMENT =====
exports.getAllImpactCards = async (req, res) => {
  try {
    const cards = await ImpactCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching impact cards:', error);
    res.status(500).json({ message: 'Failed to fetch impact cards' });
  }
};

exports.createImpactCard = async (req, res) => {
  try {
    const { title, description, imageUrl, detailedDescription } = req.body;
    // Get the next available ID
    const lastCard = await ImpactCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;
    const card = new ImpactCard({
      id: nextId,
      title,
      description,
      imageUrl,
      detailedDescription
    });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating impact card:', error);
    res.status(500).json({ message: 'Failed to create impact card' });
  }
};

exports.updateImpactCard = async (req, res) => {
  try {
    const { title, description, imageUrl, detailedDescription } = req.body;
    const card = await ImpactCard.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, detailedDescription },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Impact card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating impact card:', error);
    res.status(500).json({ message: 'Failed to update impact card' });
  }
};

exports.deleteImpactCard = async (req, res) => {
  try {
    const card = await ImpactCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Impact card not found' });
    }
    res.json({ message: 'Impact card deleted successfully' });
  } catch (error) {
    console.error('Error deleting impact card:', error);
    res.status(500).json({ message: 'Failed to delete impact card' });
  }
};

// ===== ACHIEVEMENT CARDS MANAGEMENT =====
exports.getAllAchievementCards = async (req, res) => {
  try {
    const cards = await AchievementCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching achievement cards:', error);
    res.status(500).json({ message: 'Failed to fetch achievement cards' });
  }
};

exports.createAchievementCard = async (req, res) => {
  try {
    const { icon, number, title, description } = req.body;

    // Get the next available ID
    const lastCard = await AchievementCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;

    const card = new AchievementCard({
      id: nextId,
      icon,
      number,
      title,
      description
    });

    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating achievement card:', error);
    res.status(500).json({ message: 'Failed to create achievement card' });
  }
};

exports.updateAchievementCard = async (req, res) => {
  try {
    const { icon, number, title, description } = req.body;

    const card = await AchievementCard.findByIdAndUpdate(
      req.params.id,
      { icon, number, title, description },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: 'Achievement card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating achievement card:', error);
    res.status(500).json({ message: 'Failed to update achievement card' });
  }
};

exports.deleteAchievementCard = async (req, res) => {
  try {
    const card = await AchievementCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Achievement card not found' });
    }
    res.json({ message: 'Achievement card deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement card:', error);
    res.status(500).json({ message: 'Failed to delete achievement card' });
  }
};

// ===== SUCCESS STORIES MANAGEMENT =====
exports.getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort({ id: 1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ message: 'Failed to fetch success stories' });
  }
};

exports.createSuccessStory = async (req, res) => {
  try {
    const { quote, author, location } = req.body;

    // Get the next available ID
    const lastStory = await SuccessStory.findOne().sort({ id: -1 });
    const nextId = lastStory ? lastStory.id + 1 : 1;

    const story = new SuccessStory({
      id: nextId,
      quote,
      author,
      location
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ message: 'Failed to create success story' });
  }
};

exports.updateSuccessStory = async (req, res) => {
  try {
    const { quote, author, location } = req.body;

    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { quote, author, location },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error updating success story:', error);
    res.status(500).json({ message: 'Failed to update success story' });
  }
};

exports.deleteSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }
    res.json({ message: 'Success story deleted successfully' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ message: 'Failed to delete success story' });
  }
};

// ===== MEDIA CARDS MANAGEMENT =====
exports.getAllMediaCards = async (req, res) => {
  try {
    const cards = await MediaCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching media cards:', error);
    res.status(500).json({ message: 'Failed to fetch media cards' });
  }
};

exports.createMediaCard = async (req, res) => {
  try {
    const {
      title,
      date,
      source,
      description,
      imageUrl,
      detailedDescription,
      articleUrl,
      type: mediaType,
    } = req.body;

    // Get the next available ID
    const lastCard = await MediaCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;

    const type =
      mediaType && ['press', 'video', 'photo'].includes(mediaType) ? mediaType : 'press';

    const card = new MediaCard({
      id: nextId,
      title,
      date,
      source,
      description,
      imageUrl,
      detailedDescription,
      articleUrl,
      type,
    });

    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating media card:', error);
    res.status(500).json({ message: 'Failed to create media card' });
  }
};

exports.updateMediaCard = async (req, res) => {
  try {
    const {
      title,
      date,
      source,
      description,
      imageUrl,
      detailedDescription,
      articleUrl,
      type: mediaType,
    } = req.body;

    const updates = {
      title,
      date,
      source,
      description,
      imageUrl,
      detailedDescription,
      articleUrl,
    };
    if (mediaType && ['press', 'video', 'photo'].includes(mediaType)) {
      updates.type = mediaType;
    }

    const card = await MediaCard.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!card) {
      return res.status(404).json({ message: 'Media card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating media card:', error);
    res.status(500).json({ message: 'Failed to update media card' });
  }
};

exports.deleteMediaCard = async (req, res) => {
  try {
    const card = await MediaCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Media card not found' });
    }
    res.json({ message: 'Media card deleted successfully' });
  } catch (error) {
    console.error('Error deleting media card:', error);
    res.status(500).json({ message: 'Failed to delete media card' });
  }
};

// ===== ADMIN USERS MANAGEMENT =====
exports.getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Failed to fetch admin users' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Admin user already exists' });
    const user = new AdminUser({ email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Failed to create admin user' });
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Admin user not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).json({ message: 'Failed to update admin user' });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Admin user not found' });
    res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ message: 'Failed to delete admin user' });
  }
};

// ===== EVENTS MANAGEMENT =====
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, month, day, registerLink } = req.body;
    const event = new Event({ title, date, startTime, endTime, location, description, month, day, registerLink });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, month, day, registerLink } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, startTime, endTime, location, description, month, day, registerLink },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

// ===== PROGRAMS MANAGEMENT =====
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({}).sort({ order: 1, id: 1 });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const { title, description, imageUrl, order, isActive } = req.body;
    const lastProgram = await Program.findOne().sort({ id: -1 });
    const nextId = lastProgram ? lastProgram.id + 1 : 1;
    const program = new Program({ id: nextId, title, description, imageUrl, order: order || nextId, isActive });
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Failed to create program' });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { title, description, imageUrl, order, isActive } = req.body;
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, order, isActive },
      { new: true }
    );
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Failed to update program' });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Failed to delete program' });
  }
};

// ===== PROJECTS MANAGEMENT =====
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, id: 1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, highlights, icon, color, order, isActive } = req.body;
    const lastProject = await Project.findOne().sort({ id: -1 });
    const nextId = lastProject ? lastProject.id + 1 : 1;
    const project = new Project({ id: nextId, title, description, highlights, icon, color, order: order || nextId, isActive });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, highlights, icon, color, order, isActive } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, highlights, icon, color, order, isActive },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

// ===== CONTACT INFO MANAGEMENT =====
exports.getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo({
        phone: '07263-259292',
        email: 'manasfoundation2025@gmail.com',
        address: 'Shiv Shilp, C/O S.S. Unhale, D P Road, Saoji Layout, Atali, Khamgaon - 444303, Maharashtra',
        latitude: 20.7063,
        longitude: 76.5634,
        officeHours: [
          { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Saturday', hours: '10:00 AM - 2:00 PM' },
          { day: 'Sunday', hours: 'Closed' }
        ]
      });
      await info.save();
    }
    res.json(info);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Failed to fetch contact info' });
  }
};

exports.updateContactInfo = async (req, res) => {
  try {
    const { phone, email, address, latitude, longitude, officeHours } = req.body;
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo({ phone, email, address, latitude, longitude, officeHours });
    } else {
      info.phone = phone ?? info.phone;
      info.email = email ?? info.email;
      info.address = address ?? info.address;
      info.latitude = latitude ?? info.latitude;
      info.longitude = longitude ?? info.longitude;
      info.officeHours = officeHours ?? info.officeHours;
    }
    await info.save();
    res.json(info);
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ message: 'Failed to update contact info' });
  }
};

// ===== DONATE INFO MANAGEMENT =====
exports.getDonateInfo = async (req, res) => {
  try {
    let info = await DonateInfo.findOne();
    if (!info) {
      info = new DonateInfo({
        bankName: 'State Bank of India',
        accountName: 'Manas Foundation',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        taxExemptionNote: 'All donations are eligible for 80G tax exemption. Receipt will be emailed after donation confirmation.',
        headerTitle: 'Support Our Cause',
        headerSubtitle: 'Your contribution helps us create more meaningful connections'
      });
      await info.save();
    }
    res.json(info);
  } catch (error) {
    console.error('Error fetching donate info:', error);
    res.status(500).json({ message: 'Failed to fetch donate info' });
  }
};

exports.updateDonateInfo = async (req, res) => {
  try {
    const { bankName, accountName, accountNumber, ifscCode, upiId, taxExemptionNote, headerTitle, headerSubtitle } = req.body;
    let info = await DonateInfo.findOne();
    if (!info) {
      info = new DonateInfo({ bankName, accountName, accountNumber, ifscCode, upiId, taxExemptionNote, headerTitle, headerSubtitle });
    } else {
      info.bankName = bankName ?? info.bankName;
      info.accountName = accountName ?? info.accountName;
      info.accountNumber = accountNumber ?? info.accountNumber;
      info.ifscCode = ifscCode ?? info.ifscCode;
      info.upiId = upiId ?? info.upiId;
      info.taxExemptionNote = taxExemptionNote ?? info.taxExemptionNote;
      info.headerTitle = headerTitle ?? info.headerTitle;
      info.headerSubtitle = headerSubtitle ?? info.headerSubtitle;
    }
    await info.save();
    res.json(info);
  } catch (error) {
    console.error('Error updating donate info:', error);
    res.status(500).json({ message: 'Failed to update donate info' });
  }
};

// ===== MILESTONES MANAGEMENT =====
exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({}).sort({ order: 1, id: 1 });
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ message: 'Failed to fetch milestones' });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const { date, title, description, order, isActive } = req.body;
    const lastMilestone = await Milestone.findOne().sort({ id: -1 });
    const nextId = lastMilestone ? lastMilestone.id + 1 : 1;
    const milestone = new Milestone({ id: nextId, date, title, description, order: order || nextId, isActive });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ message: 'Failed to create milestone' });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const { date, title, description, order, isActive } = req.body;
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      { date, title, description, order, isActive },
      { new: true }
    );
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Failed to update milestone' });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ message: 'Failed to delete milestone' });
  }
};

// ===== VOLUNTEER ROLES MANAGEMENT =====
exports.getAllVolunteerRoles = async (req, res) => {
  try {
    const roles = await VolunteerRole.find({}).sort({ order: 1, id: 1 });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching volunteer roles:', error);
    res.status(500).json({ message: 'Failed to fetch volunteer roles' });
  }
};

exports.createVolunteerRole = async (req, res) => {
  try {
    const { title, description, icon, order, isActive } = req.body;
    const lastRole = await VolunteerRole.findOne().sort({ id: -1 });
    const nextId = lastRole ? lastRole.id + 1 : 1;
    const role = new VolunteerRole({ id: nextId, title, description, icon, order: order || nextId, isActive });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating volunteer role:', error);
    res.status(500).json({ message: 'Failed to create volunteer role' });
  }
};

exports.updateVolunteerRole = async (req, res) => {
  try {
    const { title, description, icon, order, isActive } = req.body;
    const role = await VolunteerRole.findByIdAndUpdate(
      req.params.id,
      { title, description, icon, order, isActive },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: 'Volunteer role not found' });
    res.json(role);
  } catch (error) {
    console.error('Error updating volunteer role:', error);
    res.status(500).json({ message: 'Failed to update volunteer role' });
  }
};

exports.deleteVolunteerRole = async (req, res) => {
  try {
    const role = await VolunteerRole.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Volunteer role not found' });
    res.json({ message: 'Volunteer role deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer role:', error);
    res.status(500).json({ message: 'Failed to delete volunteer role' });
  }
}; 