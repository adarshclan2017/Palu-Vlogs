const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    default: 'Kerala'
  },
  country: {
    type: String,
    default: 'India'
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: '/assets/images/about_roadtrip.jpg'
  },
  coordinates: {
    lat: { type: Number, default: 9.9312 },
    lng: { type: Number, default: 76.2673 }
  },
  visitedDate: {
    type: String,
    default: '2026'
  },
  vlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vlog'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);
