const express = require('express');
const { getProfile, updateProfile, updateProfilePicture, getAllProfiles, getProfileById, expressInterest, removeInterest, acceptInterest, rejectInterest, getMatches, reportUser } = require('../controllers/userController.js');
const { authenticate } = require('../middleware/auth.js');
const { validateProfileUpdate } = require('../validations/auth.js');
const cardsController = require('../controllers/cardsController.js');
const { getAllEvents } = require('../controllers/adminController.js');

const router = express.Router();

const upload = require('../middleware/upload');

router.get('/profile', authenticate, getProfile);
router.get('/profiles', authenticate, getAllProfiles);
router.get('/matches', authenticate, getMatches);
router.get('/profile/:id', authenticate, getProfileById);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);
// Use 'photo' as the field name to match frontend
router.put('/profile/picture', authenticate, upload.single('photo'), updateProfilePicture);
router.post('/express-interest', authenticate, expressInterest);
router.post('/accept-interest', authenticate, acceptInterest);
router.post('/reject-interest', authenticate, rejectInterest);
router.delete('/remove-interest', authenticate, removeInterest);
router.post('/report', authenticate, reportUser);

// Public card data endpoints
router.get('/impact-cards', cardsController.getImpactCards);
router.get('/achievement-cards', cardsController.getAchievementCards);
router.get('/success-stories', cardsController.getSuccessStories);
router.get('/media-cards', cardsController.getMediaCards);
router.get('/programs', cardsController.getPrograms);
router.get('/projects', cardsController.getProjects);
router.get('/contact-info', cardsController.getContactInfo);
router.get('/donate-info', cardsController.getDonateInfo);
router.get('/milestones', cardsController.getMilestones);
router.get('/volunteer-roles', cardsController.getVolunteerRoles);

router.post('/contact', cardsController.contactFormHandler || require('../controllers/userController').contactFormHandler);

// Public events endpoint
router.get('/events', getAllEvents);

module.exports = router;
