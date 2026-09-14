/**
 * Unified Data Store Service
 * Seamlessly manages Mongoose when connected, or uses local JSON store when offline.
 */

const fs = require('fs');
const path = require('path');
const { getStatus } = require('../config/db');
const seedData = require('../data/seedData');
const bcrypt = require('bcryptjs');

// Import Mongoose models
const User = require('../models/User');
const Vlog = require('../models/Vlog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Photo = require('../models/Photo');
const Album = require('../models/Album');
const Location = require('../models/Location');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const SiteSettings = require('../models/SiteSettings');

const DB_FILE = path.join(__dirname, '../data/local_db.json');

// In-Memory Storage Cache
let localDb = null;

function initLocalStore() {
  if (localDb) return localDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      localDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return localDb;
    } catch (e) {
      console.warn('Could not read local_db.json, re-seeding...');
    }
  }

  // Generate initial local database with seed data
  const defaultHash = bcrypt.hashSync('Admin@123', 10);

  localDb = {
    users: [
      {
        _id: 'user_admin_1',
        name: 'Palu Vlogs Admin',
        email: 'admin@paluvlogs.com',
        password: defaultHash,
        role: 'admin',
        avatar: '/assets/images/logo.jpg',
        createdAt: new Date().toISOString()
      }
    ],
    categories: seedData.categories.map((c, i) => ({ ...c, _id: `cat_${i + 1}` })),
    tags: seedData.tags.map((t, i) => ({ ...t, _id: `tag_${i + 1}` })),
    albums: seedData.albums.map((a, i) => ({ ...a, _id: `alb_${i + 1}` })),
    locations: seedData.locations.map((l, i) => ({ ...l, _id: `loc_${i + 1}` })),
    vlogs: seedData.vlogs.map((v, i) => ({ ...v, _id: `vlog_${i + 1}` })),
    photos: seedData.photos.map((p, i) => ({ ...p, _id: `photo_${i + 1}` })),
    settings: { ...seedData.siteSettings, _id: 'settings_1' },
    messages: seedData.initialMessages.map((m, i) => ({ ...m, _id: `msg_${i + 1}` })),
    subscribers: [
      { _id: 'sub_1', email: 'fan1@paluvlogs.com', isActive: true, subscribedAt: new Date().toISOString() },
      { _id: 'sub_2', email: 'keralavibes@example.com', isActive: true, subscribedAt: new Date().toISOString() }
    ]
  };

  saveLocalStore();
  return localDb;
}

function saveLocalStore() {
  if (process.env.VERCEL) {
    // In Vercel serverless environment, local filesystem is read-only.
    return;
  }
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    console.warn('[DataStore] Notice saving local_db.json:', err.message);
  }
}

// Data Store APIs
const dataStore = {
  // Check if live mongo is active
  isMongoActive: () => getStatus(),

  // Users
  getUserByEmail: async (email) => {
    if (getStatus()) {
      return await User.findOne({ email }).select('+password');
    }
    const db = initLocalStore();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: async (id) => {
    if (getStatus()) {
      return await User.findById(id);
    }
    const db = initLocalStore();
    const user = db.users.find(u => u._id === id);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },

  // Vlogs
  getVlogs: async ({ search, category, tag, limit, page, sort } = {}) => {
    if (getStatus()) {
      let query = {};
      if (category && category !== 'all') query.category = category;
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const vlogs = await Vlog.find(query).sort({ publishedAt: -1 });
      return vlogs;
    }

    const db = initLocalStore();
    let result = [...db.vlogs];

    if (category && category !== 'all') {
      result = result.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      result = result.filter(v => v.tags && v.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v => v.title.toLowerCase().includes(s) || v.description.toLowerCase().includes(s));
    }

    // Sort
    if (sort === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return result;
  },

  getVlogBySlug: async (slug) => {
    if (getStatus()) {
      return await Vlog.findOne({ slug });
    }
    const db = initLocalStore();
    return db.vlogs.find(v => v.slug === slug);
  },

  createVlog: async (data) => {
    if (getStatus()) {
      return await Vlog.create(data);
    }
    const db = initLocalStore();
    const newVlog = {
      _id: `vlog_${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      ...data
    };
    db.vlogs.unshift(newVlog);
    saveLocalStore();
    return newVlog;
  },

  updateVlog: async (id, data) => {
    if (getStatus()) {
      return await Vlog.findByIdAndUpdate(id, data, { new: true });
    }
    const db = initLocalStore();
    const index = db.vlogs.findIndex(v => v._id === id);
    if (index !== -1) {
      db.vlogs[index] = { ...db.vlogs[index], ...data };
      saveLocalStore();
      return db.vlogs[index];
    }
    return null;
  },

  deleteVlog: async (id) => {
    if (getStatus()) {
      return await Vlog.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const index = db.vlogs.findIndex(v => v._id === id);
    if (index !== -1) {
      const deleted = db.vlogs.splice(index, 1)[0];
      saveLocalStore();
      return deleted;
    }
    return null;
  },

  incrementVlogViews: async (id) => {
    if (getStatus()) {
      return await Vlog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    }
    const db = initLocalStore();
    const vlog = db.vlogs.find(v => v._id === id || v.slug === id);
    if (vlog) {
      vlog.views = (vlog.views || 0) + 1;
      saveLocalStore();
    }
  },

  // Gallery / Photos & Albums
  getAlbums: async () => {
    if (getStatus()) {
      return await Album.find();
    }
    const db = initLocalStore();
    return db.albums;
  },

  getPhotos: async ({ albumSlug } = {}) => {
    if (getStatus()) {
      const query = albumSlug && albumSlug !== 'all' ? { albumSlug } : {};
      return await Photo.find(query).sort({ createdAt: -1 });
    }
    const db = initLocalStore();
    if (albumSlug && albumSlug !== 'all') {
      return db.photos.filter(p => p.albumSlug === albumSlug);
    }
    return db.photos;
  },

  createPhoto: async (data) => {
    if (getStatus()) {
      return await Photo.create(data);
    }
    const db = initLocalStore();
    const newPhoto = {
      _id: `photo_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    db.photos.unshift(newPhoto);
    saveLocalStore();
    return newPhoto;
  },

  deletePhoto: async (id) => {
    if (getStatus()) {
      return await Photo.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const index = db.photos.findIndex(p => p._id === id);
    if (index !== -1) {
      const deleted = db.photos.splice(index, 1)[0];
      saveLocalStore();
      return deleted;
    }
    return null;
  },

  // Locations
  getLocations: async () => {
    if (getStatus()) {
      return await Location.find().sort({ visitedDate: -1 });
    }
    const db = initLocalStore();
    return db.locations;
  },

  createLocation: async (data) => {
    if (getStatus()) {
      return await Location.create(data);
    }
    const db = initLocalStore();
    const newLoc = {
      _id: `loc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    db.locations.push(newLoc);
    saveLocalStore();
    return newLoc;
  },

  updateLocation: async (id, data) => {
    if (getStatus()) {
      return await Location.findByIdAndUpdate(id, data, { new: true });
    }
    const db = initLocalStore();
    const index = db.locations.findIndex(l => l._id === id);
    if (index !== -1) {
      db.locations[index] = { ...db.locations[index], ...data };
      saveLocalStore();
      return db.locations[index];
    }
    return null;
  },

  deleteLocation: async (id) => {
    if (getStatus()) {
      return await Location.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const index = db.locations.findIndex(l => l._id === id);
    if (index !== -1) {
      const deleted = db.locations.splice(index, 1)[0];
      saveLocalStore();
      return deleted;
    }
    return null;
  },

  // Contact Messages
  getContactMessages: async () => {
    if (getStatus()) {
      return await ContactMessage.find().sort({ createdAt: -1 });
    }
    const db = initLocalStore();
    return db.messages;
  },

  createContactMessage: async (data) => {
    if (getStatus()) {
      return await ContactMessage.create(data);
    }
    const db = initLocalStore();
    const newMsg = {
      _id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...data
    };
    db.messages.unshift(newMsg);
    saveLocalStore();
    return newMsg;
  },

  toggleMessageRead: async (id) => {
    if (getStatus()) {
      const msg = await ContactMessage.findById(id);
      if (msg) {
        msg.isRead = !msg.isRead;
        await msg.save();
        return msg;
      }
      return null;
    }
    const db = initLocalStore();
    const msg = db.messages.find(m => m._id === id);
    if (msg) {
      msg.isRead = !msg.isRead;
      saveLocalStore();
      return msg;
    }
    return null;
  },

  deleteContactMessage: async (id) => {
    if (getStatus()) {
      return await ContactMessage.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const index = db.messages.findIndex(m => m._id === id);
    if (index !== -1) {
      const deleted = db.messages.splice(index, 1)[0];
      saveLocalStore();
      return deleted;
    }
    return null;
  },

  // Newsletter
  getSubscribers: async () => {
    if (getStatus()) {
      return await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
    }
    const db = initLocalStore();
    return db.subscribers;
  },

  addSubscriber: async (email) => {
    if (getStatus()) {
      const existing = await NewsletterSubscriber.findOne({ email });
      if (existing) return existing;
      return await NewsletterSubscriber.create({ email });
    }
    const db = initLocalStore();
    const exists = db.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;
    const newSub = {
      _id: `sub_${Date.now()}`,
      email,
      isActive: true,
      subscribedAt: new Date().toISOString()
    };
    db.subscribers.push(newSub);
    saveLocalStore();
    return newSub;
  },

  // Site Settings
  getSettings: async () => {
    if (getStatus()) {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create(seedData.siteSettings);
      return settings;
    }
    const db = initLocalStore();
    return db.settings;
  },

  updateSettings: async (data) => {
    if (getStatus()) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        return await SiteSettings.create(data);
      }
      Object.assign(settings, data);
      settings.updatedAt = Date.now();
      return await settings.save();
    }
    const db = initLocalStore();
    db.settings = { ...db.settings, ...data, updatedAt: new Date().toISOString() };
    saveLocalStore();
    return db.settings;
  },

  // Dashboard Stats
  getStats: async () => {
    const vlogs = await dataStore.getVlogs();
    const photos = await dataStore.getPhotos();
    const locations = await dataStore.getLocations();
    const messages = await dataStore.getContactMessages();
    const subscribers = await dataStore.getSubscribers();

    const totalViews = vlogs.reduce((acc, v) => acc + (v.views || 0), 0);
    const unreadMessages = messages.filter(m => !m.isRead).length;

    return {
      totalVlogs: vlogs.length,
      totalPhotos: photos.length,
      totalLocations: locations.length,
      totalMessages: messages.length,
      unreadMessages,
      totalSubscribers: subscribers.length,
      totalViews
    };
  }
};

// Initialize default local store on startup
initLocalStore();

module.exports = dataStore;
