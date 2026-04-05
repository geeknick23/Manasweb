const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = { Milestone };
