const mongoose = require('mongoose');

const mediaCardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  detailedDescription: { type: String, required: false },
  articleUrl: { type: String, required: false }, // Link to original article / video
  type: {
    type: String,
    enum: ['press', 'video', 'photo'],
    default: 'press',
  },
});

const MediaCard = mongoose.model('MediaCard', mediaCardSchema);

module.exports = { MediaCard }; 