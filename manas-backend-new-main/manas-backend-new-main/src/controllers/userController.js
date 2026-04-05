const { User } = require('../models/User.js');
const { updateUserSchema } = require('../validations/auth.js');
const { sendInterestMatchEmail, sendContactMail } = require('../services/emailService.js');
const { uploadImage, deleteImage, getPublicIdFromUrl, isCloudinaryUrl, isBase64DataUrl } = require('../services/cloudinaryService.js');

// Update User
const updateUser = async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('expressed_interests.user', 'full_name profile_photo date_of_birth marital_status location')
      .populate('received_interests.user', 'full_name profile_photo date_of_birth marital_status location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Starting profile update for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Handle profile photo if present - upload to Cloudinary
    if (updateData.profile_photo !== undefined) {
      if (updateData.profile_photo === '') {
        // Delete old photo from Cloudinary if it exists
        if (user.profile_photo && isCloudinaryUrl(user.profile_photo)) {
          const oldPublicId = getPublicIdFromUrl(user.profile_photo);
          if (oldPublicId) await deleteImage(oldPublicId);
        }
        user.profile_photo = undefined;
        user.has_profile_photo = false;
      } else if (isBase64DataUrl(updateData.profile_photo)) {
        // Upload new photo to Cloudinary
        try {
          // Delete old photo if exists
          if (user.profile_photo && isCloudinaryUrl(user.profile_photo)) {
            const oldPublicId = getPublicIdFromUrl(user.profile_photo);
            if (oldPublicId) await deleteImage(oldPublicId);
          }

          const result = await uploadImage(updateData.profile_photo, 'profile_photos', `user_${userId}`);
          user.profile_photo = result.url;
          user.has_profile_photo = true;
        } catch (uploadError) {
          console.error('Failed to upload profile photo:', uploadError);
          return res.status(500).json({ message: 'Failed to upload profile photo' });
        }
      } else if (isCloudinaryUrl(updateData.profile_photo)) {
        // Already a Cloudinary URL, keep it
        user.profile_photo = updateData.profile_photo;
        user.has_profile_photo = true;
      } else {
        return res.status(400).json({ message: 'Invalid profile photo format' });
      }
    }

    // Update all simple fields
    const fieldsToUpdate = [
      'full_name',
      'email',
      'date_of_birth',
      'gender',
      'marital_status',
      'education',
      'profession',
      'phone_number',
      'interests_hobbies',
      'brief_personal_description',
      'caste',
      'religion',
      'divorce_finalized',
      'children',
      'children_count'
      // NOTE: is_verified intentionally excluded — only admin or system can change verification status
    ];
    let hasUpdates = false;
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
        hasUpdates = true;
      }
    });

    // Update location if present
    if (updateData.location) {
      user.location = {
        village: updateData.location.village !== undefined ? updateData.location.village : (user.location?.village || ''),
        tehsil: updateData.location.tehsil !== undefined ? updateData.location.tehsil : (user.location?.tehsil || ''),
        district: updateData.location.district !== undefined ? updateData.location.district : (user.location?.district || ''),
        state: updateData.location.state !== undefined ? updateData.location.state : (user.location?.state || ''),
      };
      hasUpdates = true;
    }

    // Update guardian if present
    if (updateData.guardian) {
      user.guardian = {
        name: updateData.guardian.name !== undefined ? updateData.guardian.name : (user.guardian?.name || ''),
        contact: updateData.guardian.contact !== undefined ? updateData.guardian.contact : (user.guardian?.contact || ''),
      };
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    try {
      await user.save();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error saving user data' });
    }

    const updatedUser = await User.findById(userId).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile Picture
const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the photo data
    let photoData;
    if (req.file) {
      // Multer file upload - read and convert to base64 for Cloudinary
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(req.file.path);
      photoData = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      // Clean up temp file
      fs.unlinkSync(req.file.path);
    } else if (req.body.profile_photo) {
      photoData = req.body.profile_photo;
    }

    if (!photoData) {
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    // Get current user to check for existing photo
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old photo from Cloudinary if exists
    if (existingUser.profile_photo && isCloudinaryUrl(existingUser.profile_photo)) {
      const oldPublicId = getPublicIdFromUrl(existingUser.profile_photo);
      if (oldPublicId) await deleteImage(oldPublicId);
    }

    // Upload new photo to Cloudinary
    let profile_photo;
    if (isBase64DataUrl(photoData)) {
      try {
        const result = await uploadImage(photoData, 'profile_photos', `user_${userId}`);
        profile_photo = result.url;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ message: 'Failed to upload profile photo' });
      }
    } else if (isCloudinaryUrl(photoData)) {
      // Already a Cloudinary URL
      profile_photo = photoData;
    } else {
      return res.status(400).json({ message: 'Invalid profile photo format. Expected base64 data URL.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profile_photo, has_profile_photo: true },
      { new: true }
    ).select('-password');

    res.json({ profile_photo: user.profile_photo });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};

// Get Profile by ID (for viewing other profiles)
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    // Don't allow users to view their own profile through this endpoint
    if (id === currentUserId.toString()) {
      return res.status(403).json({ message: 'Use /profile endpoint to view your own profile' });
    }

    const profile = await User.findById(id)
      .select('-password -email -phone_number') // Exclude sensitive information
      .lean();

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Get All Profiles (for view profiles page)
const getAllProfiles = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUserGender = req.user.gender;
    // Get query parameters for filtering
    const {
      name,
      location,
      yearOfBirthFrom,
      yearOfBirthTo,
      profession,
      search,
      gender, // keep for other filters, but will override below
      marital_status,
      education,
      caste,
      religion,
      limit = 50,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {
      _id: { $ne: currentUserId } // Exclude current user
    };

    // Gender constraint: male sees only female, female sees only male
    if (currentUserGender === 'male') {
      filter.gender = 'female';
    } else if (currentUserGender === 'female') {
      filter.gender = 'male';
    }

    // Name filter
    if (name) {
      filter.full_name = { $regex: name, $options: 'i' };
    }

    // Caste filter
    if (caste) {
      filter.caste = caste;
    }

    // Religion filter
    if (religion) {
      filter.religion = religion;
    }

    // Location filter - search across all location fields individually
    if (location) {
      const locationSearch = location.toLowerCase().trim();
      const locationRegex = { $regex: locationSearch, $options: 'i' };
      filter.$or = [
        { 'location.village': locationRegex },
        { 'location.tehsil': locationRegex },
        { 'location.district': locationRegex },
        { 'location.state': locationRegex }
      ];
    }

    // Year of birth range filter
    if (yearOfBirthFrom || yearOfBirthTo) {
      filter.date_of_birth = {};
      if (yearOfBirthFrom) {
        const fromYear = parseInt(yearOfBirthFrom);
        if (!isNaN(fromYear)) {
          filter.date_of_birth.$gte = new Date(`${fromYear}-01-01T00:00:00.000Z`);
        }
      }
      if (yearOfBirthTo) {
        const toYear = parseInt(yearOfBirthTo);
        if (!isNaN(toYear)) {
          filter.date_of_birth.$lte = new Date(`${toYear}-12-31T23:59:59.999Z`);
        }
      }
    }

    // Profession filter
    if (profession) {
      filter.profession = { $regex: profession, $options: 'i' };
    }

    // Marital status filter
    if (marital_status) {
      filter.marital_status = marital_status;
    }

    // Education filter
    if (education) {
      filter.education = education;
    }

    // Search filter (searches across multiple fields)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchOr = [
        { full_name: searchRegex },
        { profession: searchRegex },
        { interests_hobbies: searchRegex },
        { brief_personal_description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
      // If we already have location filter, combine with AND
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: searchOr }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    let sort = { has_profile_photo: -1, createdAt: -1, _id: 1 }; // Default: Photos first, then Newest
    if (req.query.sort === 'oldest') {
      sort = { has_profile_photo: -1, createdAt: 1, _id: 1 };
    } else if (req.query.sort === 'age_asc') {
      // Age Ascending = Youngest First = Higher DOB (e.g. 2000 > 1990)
      sort = { has_profile_photo: -1, date_of_birth: -1, _id: 1 };
    } else if (req.query.sort === 'age_desc') {
      // Age Descending = Oldest First = Lower DOB
      sort = { has_profile_photo: -1, date_of_birth: 1, _id: 1 };
    }

    // Fetch profiles with filters
    let profiles = await User.find(filter)
      .select('-password -email -phone_number') // Exclude sensitive information
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Deduplicate profiles based on content (Name + DOB + Gender) to handle multiple registrations
    const uniqueContentMap = new Map();
    profiles.forEach(profile => {
      // Create a composite key for logical uniqueness
      const dobStr = profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : 'nodob';
      const compositeKey = `${profile.full_name?.toLowerCase().trim()}|${dobStr}|${profile.gender}|${profile.caste || ''}`;

      if (!uniqueContentMap.has(compositeKey)) {
        uniqueContentMap.set(compositeKey, profile);
      }
    });
    profiles = Array.from(uniqueContentMap.values());

    // Get total count for pagination
    const totalCount = await User.countDocuments(filter);

    res.json({
      profiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + profiles.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ message: 'Failed to fetch profiles' });
  }
};

const expressInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: 'Cannot express interest in yourself.' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Remove any existing interest between these users (both directions)
    await User.findByIdAndUpdate(currentUserId, {
      $pull: {
        expressed_interests: { user: targetUserId },
        received_interests: { user: targetUserId }
      }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: {
        expressed_interests: { user: currentUserId },
        received_interests: { user: currentUserId }
      }
    });

    // Add new interest
    currentUser.expressed_interests.push({ user: targetUserId, sentAt: new Date(), status: 'pending' });
    await currentUser.save();
    targetUser.received_interests.push({ user: currentUserId, sentAt: new Date(), status: 'pending' });
    await targetUser.save();

    // Socket Notification
    const io = req.app.get('io');
    if (io) {
      io.to(targetUserId).emit('interestReceived', {
        senderId: currentUserId,
        senderName: currentUser.full_name,
        message: `${currentUser.full_name} has expressed interest in your profile.`
      });
    }

    // Email Notification
    try {
      if (targetUser.email) {
        const { sendInterestReceivedEmail } = require('../services/emailService');
        await sendInterestReceivedEmail(currentUser.full_name, targetUser.email);
      }
    } catch (emailError) {
      console.error('Error sending interest received email:', emailError);
    }

    res.status(200).json({ message: 'Interest expressed successfully!' });
  } catch (error) {
    console.error('Error expressing interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the received interest status to accepted
    await User.findByIdAndUpdate(currentUserId, {
      $set: {
        'received_interests.$[elem].status': 'accepted'
      }
    }, {
      arrayFilters: [{ 'elem.user': targetUserId }]
    });
    // Update the expressed interest status to accepted for the sender
    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        'expressed_interests.$[elem].status': 'accepted'
      }
    }, {
      arrayFilters: [{ 'elem.user': currentUserId }]
    });

    // Send emails to both users with contact information
    try {
      await sendInterestMatchEmail(targetUser, currentUser);
    } catch (emailError) {
      console.error('Error sending match emails:', emailError);
      // Don't fail the request if email fails
    }

    // Socket Notification for Match
    const io = req.app.get('io');
    if (io) {
      io.to(targetUserId).emit('newMatch', {
        matchId: currentUserId,
        matchName: currentUser.full_name,
        message: `Congratulations! You matched with ${currentUser.full_name}.`
      });

      // Optionally notify current user too (though UI usually updates immediately)
      // io.to(currentUserId).emit('newMatch', { ... });
    }

    res.status(200).json({ message: 'Interest accepted! Contact information has been shared with both users.' });
  } catch (error) {
    console.error('Error accepting interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the received interest status to rejected
    await User.findByIdAndUpdate(currentUserId, {
      $set: {
        'received_interests.$[elem].status': 'rejected'
      }
    }, {
      arrayFilters: [{ 'elem.user': targetUserId }]
    });
    // Update the expressed interest status to rejected for the sender
    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        'expressed_interests.$[elem].status': 'rejected'
      }
    }, {
      arrayFilters: [{ 'elem.user': currentUserId }]
    });

    res.status(200).json({ message: 'Interest rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeInterest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    // Remove from current user's expressed_interests
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { expressed_interests: { user: targetUserId } }
    });

    // Remove from target user's received_interests
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { received_interests: { user: currentUserId } }
    });

    res.status(200).json({ message: 'Interest removed successfully!' });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const contactFormHandler = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    await sendContactMail({ name, email, subject, message });
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form mail error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId)
      .populate('expressed_interests.user', 'full_name profile_photo')
      .populate('received_interests.user', 'full_name profile_photo');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matches = [];

    // Check expressed interests (accepted)
    user.expressed_interests.forEach(interest => {
      if (interest.status === 'accepted' && interest.user) {
        matches.push(interest.user);
      }
    });

    // Check received interests (accepted)
    user.received_interests.forEach(interest => {
      if (interest.status === 'accepted' && interest.user) {
        // Avoid duplicates if bidirectional (though logic should prevent it, safe to check)
        if (!matches.some(m => m._id.toString() === interest.user._id.toString())) {
          matches.push(interest.user);
        }
      }
    });

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Report User
const { Report } = require('../models/Report.js');

const reportUser = async (req, res) => {
  try {
    const reporterId = req.user._id;
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: 'Reported user ID and reason are required.' });
    }

    if (reporterId.toString() === reportedUserId.toString()) {
      return res.status(400).json({ message: 'You cannot report yourself.' });
    }

    const report = new Report({
      reporter: reporterId,
      reportedUser: reportedUserId,
      reason,
      description
    });

    await report.save();

    // Ideally, send notification to admin here

    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateProfilePicture,
  getAllProfiles,
  getProfileById,
  expressInterest,
  removeInterest,
  acceptInterest,
  rejectInterest,
  contactFormHandler,
  getMatches,
  reportUser
};
