const mongoose = require('mongoose');

const volunteerRoleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'star' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const VolunteerRole = mongoose.model('VolunteerRole', volunteerRoleSchema);
module.exports = { VolunteerRole };
