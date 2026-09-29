import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  channelName: {
    type: String,
    default: 'Palu Vlogs'
  },
  tagline: {
    type: String,
    default: "It's not about the views, it's about the memories"
  },
  bio: {
    type: String,
    default: "A passionate group of teams and friends from Kanniyakumari, capturing unscripted road journeys, coastal rides, and authentic moments. Started in April 2026 — for us, it's not about the views, it's about the memories."
  },
  profileImage: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
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
  visitorCount: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
