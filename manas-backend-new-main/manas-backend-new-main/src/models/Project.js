const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    icon: { type: String, default: 'star' },
    color: { type: String, default: '#6366f1' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = { Project };
