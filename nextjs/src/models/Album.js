import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: '/assets/images/hero_team.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Album = mongoose.models.Album || mongoose.model('Album', albumSchema);
export default Album;
