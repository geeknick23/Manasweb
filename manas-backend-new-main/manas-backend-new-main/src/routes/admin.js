const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { authenticate } = require('../middleware/auth.js');
const { authLimiter } = require('../middleware/rateLimiter.js');

// Admin authentication routes (no auth required, rate limited)
router.post('/send-otp', authLimiter, adminController.sendAdminOTP);
router.post('/verify-otp', authLimiter, adminController.verifyAdminOTP);

// Protected admin routes (require JWT auth + admin role)
router.use(authenticate);

// Admin role verification middleware
router.use((req, res, next) => {
    // Check if the authenticated user is an admin
    if (!req.admin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
});

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Impact Cards management
router.get('/impact-cards', adminController.getAllImpactCards);
router.post('/impact-cards', adminController.createImpactCard);
router.put('/impact-cards/:id', adminController.updateImpactCard);
router.delete('/impact-cards/:id', adminController.deleteImpactCard);

// Achievement Cards management
router.get('/achievement-cards', adminController.getAllAchievementCards);
router.post('/achievement-cards', adminController.createAchievementCard);
router.put('/achievement-cards/:id', adminController.updateAchievementCard);
router.delete('/achievement-cards/:id', adminController.deleteAchievementCard);

// Success Stories management
router.get('/success-stories', adminController.getAllSuccessStories);
router.post('/success-stories', adminController.createSuccessStory);
router.put('/success-stories/:id', adminController.updateSuccessStory);
router.delete('/success-stories/:id', adminController.deleteSuccessStory);

// Media Cards management
router.get('/media-cards', adminController.getAllMediaCards);
router.post('/media-cards', adminController.createMediaCard);
router.put('/media-cards/:id', adminController.updateMediaCard);
router.delete('/media-cards/:id', adminController.deleteMediaCard);

// Admin Users management
router.get('/admin-users', adminController.getAllAdminUsers);
router.post('/admin-users', adminController.createAdminUser);
router.put('/admin-users/:id', adminController.updateAdminUser);
router.delete('/admin-users/:id', adminController.deleteAdminUser);

// Events management
router.get('/events', adminController.getAllEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Programs management
router.get('/programs', adminController.getAllPrograms);
router.post('/programs', adminController.createProgram);
router.put('/programs/:id', adminController.updateProgram);
router.delete('/programs/:id', adminController.deleteProgram);

// Projects management
router.get('/projects', adminController.getAllProjects);
router.post('/projects', adminController.createProject);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// Contact Info management
router.get('/contact-info', adminController.getContactInfo);
router.put('/contact-info', adminController.updateContactInfo);

// Donate Info management
router.get('/donate-info', adminController.getDonateInfo);
router.put('/donate-info', adminController.updateDonateInfo);

// Milestones management
router.get('/milestones', adminController.getAllMilestones);
router.post('/milestones', adminController.createMilestone);
router.put('/milestones/:id', adminController.updateMilestone);
router.delete('/milestones/:id', adminController.deleteMilestone);

// Volunteer Roles management
router.get('/volunteer-roles', adminController.getAllVolunteerRoles);
router.post('/volunteer-roles', adminController.createVolunteerRole);
router.put('/volunteer-roles/:id', adminController.updateVolunteerRole);
router.delete('/volunteer-roles/:id', adminController.deleteVolunteerRole);

module.exports = router; 