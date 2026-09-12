const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  albumSlug: {
    type: String,
    default: 'road-trips'
  },
  location: {
    type: String,
    default: 'Kerala'
  },
  date: {
    type: String,
    default: '2026'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', photoSchema);
