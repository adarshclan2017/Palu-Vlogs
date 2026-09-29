import mongoose from 'mongoose';

const vlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vlog title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  youtubeUrl: {
    type: String,
    required: [true, 'YouTube URL is required'],
    trim: true
  },
  youtubeId: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '15:00'
  },
  category: {
    type: String,
    required: true,
    default: 'Road Trips'
  },
  tags: [{
    type: String,
    trim: true
  }],
  locationName: {
    type: String,
    default: 'Kerala, India'
  },
  location: {
    type: mongoose.Schema.Types.Mixed
  },
  views: {
    type: Number,
    default: 1200
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  reactions: {
    type: Map,
    of: Number,
    default: () => ({ fire: 0, heart: 0, laugh: 0, shock: 0 })
  },
  episodeNumber: {
    type: Number
  },
  season: {
    type: Number,
    default: 2
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vlog = mongoose.models.Vlog || mongoose.model('Vlog', vlogSchema);
export default Vlog;
