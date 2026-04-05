const mongoose = require('mongoose');

const donateInfoSchema = new mongoose.Schema({
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' },
    taxExemptionNote: { type: String, default: 'All donations are eligible for 80G tax exemption.' },
    headerTitle: { type: String, default: 'Support Our Cause' },
    headerSubtitle: { type: String, default: 'Your contribution helps us create more meaningful connections' }
}, { timestamps: true });

const DonateInfo = mongoose.model('DonateInfo', donateInfoSchema);
module.exports = { DonateInfo };
