const { ImpactCard } = require('../models/ImpactCard');
const { AchievementCard } = require('../models/AchievementCard');
const { SuccessStory } = require('../models/SuccessStory');
const { MediaCard } = require('../models/MediaCard');
const { Program } = require('../models/Program');
const { Project } = require('../models/Project');
const { ContactInfo } = require('../models/ContactInfo');
const { DonateInfo } = require('../models/DonateInfo');
const { Milestone } = require('../models/Milestone');
const { VolunteerRole } = require('../models/VolunteerRole');

// Get all Impact Cards
const getImpactCards = async (req, res) => {
  try {
    const cards = await ImpactCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch impact cards' });
  }
};

// Get all Achievement Cards
const getAchievementCards = async (req, res) => {
  try {
    const cards = await AchievementCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievement cards' });
  }
};

// Get all Success Stories
const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch success stories' });
  }
};

// Get all Media Cards
const getMediaCards = async (req, res) => {
  try {
    const cards = await MediaCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch media cards' });
  }
};

// Get all Programs (public)
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
};

// Get all Projects (public)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// Get Contact Info (public)
const getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      return res.json({
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
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact info' });
  }
};

// Get Donate Info (public)
const getDonateInfo = async (req, res) => {
  try {
    let info = await DonateInfo.findOne();
    if (!info) {
      return res.json({
        bankName: 'State Bank of India',
        accountName: 'Manas Foundation',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        taxExemptionNote: 'All donations are eligible for 80G tax exemption.',
        headerTitle: 'Support Our Cause',
        headerSubtitle: 'Your contribution helps us create more meaningful connections'
      });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donate info' });
  }
};

// Get all Milestones (public)
const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ isActive: true }).sort({ order: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch milestones' });
  }
};

// Get all Volunteer Roles (public)
const getVolunteerRoles = async (req, res) => {
  try {
    const roles = await VolunteerRole.find({ isActive: true }).sort({ order: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteer roles' });
  }
};

module.exports = {
  getImpactCards,
  getAchievementCards,
  getSuccessStories,
  getMediaCards,
  getPrograms,
  getProjects,
  getContactInfo,
  getDonateInfo,
  getMilestones,
  getVolunteerRoles
}; 