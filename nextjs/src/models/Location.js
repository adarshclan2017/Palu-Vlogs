import mongoose from 'mongoose';

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
    default: ''
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
    type: mongoose.Schema.Types.Mixed
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
export default Location;
