const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// POST /api/volunteer - Rate limited to prevent spam
router.post('/', apiLimiter, volunteerController.createVolunteer);

// GET /api/volunteer (admin only - protected)
router.get('/', authenticate, volunteerController.getVolunteers);

module.exports = router; 