const mongoose = require('mongoose');

const officeHourSchema = new mongoose.Schema({
    day: { type: String, required: true },
    hours: { type: String, required: true }
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    officeHours: [officeHourSchema]
}, { timestamps: true });

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);
module.exports = { ContactInfo };
