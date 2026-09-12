const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  channelName: {
    type: String,
    default: 'Palu Vlogs'
  },
  tagline: {
    type: String,
    default: 'Oru Palu Vlogs — Vegetable Gang | Fun · Vibes · Memories · Chaos'
  },
  bio: {
    type: String,
    default: 'Four friends, one camera, and a running vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.'
  },
  profileImage: {
    type: String,
    default: '/assets/images/logo.jpg'
  },
  coverImage: {
    type: String,
    default: '/assets/images/hero_team.jpg'
  },
  youtubeUrl: {
    type: String,
    default: 'https://youtube.com/@paluvlogs'
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/paluvlogs'
  },
  whatsappUrl: {
    type: String,
    default: 'https://whatsapp.com/channel/paluvlogs'
  },
  email: {
    type: String,
    default: 'contact@paluvlogs.com'
  },
  subscriberCount: {
    type: String,
    default: '125K'
  },
  totalViews: {
    type: String,
    default: '4.8M'
  },
  featuredVlogSlug: {
    type: String,
    default: 'great-eggplant-market-heist'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
