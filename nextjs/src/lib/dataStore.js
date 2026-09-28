/**
 * Unified Data Store — Next.js ESM version
 * Uses MongoDB/Mongoose when available, falls back to local JSON store.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getStatus } from './db.js';

const DB_FILE = path.join(process.cwd(), 'data', 'local_db.json');
let localDb = null;

// Seed data inline for self-contained operation
const SEED = {
  users: [],
  vlogs: [], photos: [], albums: [], locations: [],
  messages: [], subscribers: [], settings: null, categories: [], tags: []
};

function initLocalStore() {
  if (localDb) return localDb;
  if (fs.existsSync(DB_FILE)) {
    try {
      localDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return localDb;
    } catch {}
  }

  const hash = bcrypt.hashSync('Admin@123', 10);
  localDb = {
    ...SEED,
    users: [{
      _id: 'user_admin_1', name: 'Palu Vlogs Admin',
      email: 'admin@paluvlogs.com', password: hash,
      role: 'admin', avatar: '/assets/images/logo.jpg',
      createdAt: new Date().toISOString()
    }],
    settings: {
      _id: 'settings_1',
      channelName: 'Palu Vlogs',
      tagline: 'Oru Palu Vlogs — Vegetable Gang | Fun · Vibes · Memories · Chaos',
      bio: 'Four friends, one camera, and a running vegetable-costume joke that got completely out of hand.',
      profileImage: '/assets/images/logo.jpg',
      coverImage: '/assets/images/hero_team.jpg',
      youtubeUrl: 'https://youtube.com/@paluvlogs',
      instagramUrl: 'https://instagram.com/paluvlogs',
      email: 'contact@paluvlogs.com',
      subscriberCount: '125K', totalViews: '4.8M',
      updatedAt: new Date().toISOString()
    }
  };
  saveLocalStore();
  return localDb;
}

function saveLocalStore() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    console.error('dataStore save error:', err.message);
  }
}

export const dataStore = {
  isMongoActive: () => getStatus(),

  // Users
  getUserByEmail: async (email) => {
    if (getStatus()) {
      const { default: UserModel } = await import('../models/User.js');
      return UserModel.findOne({ email }).select('+password');
    }
    const db = initLocalStore();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  getUserById: async (id) => {
    if (getStatus()) {
      const { default: UserModel } = await import('../models/User.js');
      return UserModel.findById(id);
    }
    const db = initLocalStore();
    const user = db.users.find(u => u._id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  // Vlogs
  getVlogs: async ({ search, category, tag, sort } = {}) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      let query = {};
      if (category && category !== 'all') query.category = category;
      if (tag) query.tags = tag;
      if (search) query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      return VlogModel.find(query).sort({ publishedAt: -1 });
    }
    const db = initLocalStore();
    let result = [...(db.vlogs || [])];
    if (category && category !== 'all') result = result.filter(v => v.category?.toLowerCase() === category.toLowerCase());
    if (tag) result = result.filter(v => v.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v => v.title?.toLowerCase().includes(s) || v.description?.toLowerCase().includes(s));
    }
    return sort === 'views' ? result.sort((a, b) => (b.views || 0) - (a.views || 0)) : result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  },

  getVlogBySlug: async (slug) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      return VlogModel.findOne({ slug });
    }
    const db = initLocalStore();
    return db.vlogs?.find(v => v.slug === slug) || null;
  },

  createVlog: async (data) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      return VlogModel.create(data);
    }
    const db = initLocalStore();
    const v = { _id: `vlog_${Date.now()}`, views: 0, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(), ...data };
    db.vlogs = [v, ...(db.vlogs || [])];
    saveLocalStore(); return v;
  },

  updateVlog: async (id, data) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      return VlogModel.findByIdAndUpdate(id, data, { new: true });
    }
    const db = initLocalStore();
    const i = db.vlogs.findIndex(v => v._id === id);
    if (i === -1) return null;
    db.vlogs[i] = { ...db.vlogs[i], ...data };
    saveLocalStore(); return db.vlogs[i];
  },

  deleteVlog: async (id) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      return VlogModel.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const i = db.vlogs.findIndex(v => v._id === id);
    if (i === -1) return null;
    const [d] = db.vlogs.splice(i, 1); saveLocalStore(); return d;
  },

  incrementVlogViews: async (id) => {
    if (getStatus()) {
      const { default: VlogModel } = await import('../models/Vlog.js');
      return VlogModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    }
    const db = initLocalStore();
    const v = db.vlogs?.find(v => v._id === id || v.slug === id);
    if (v) { v.views = (v.views || 0) + 1; saveLocalStore(); }
  },

  // Gallery
  getAlbums: async () => {
    if (getStatus()) {
      const { default: AlbumModel } = await import('../models/Album.js');
      return AlbumModel.find();
    }
    return (initLocalStore().albums || []);
  },

  getPhotos: async ({ albumSlug } = {}) => {
    if (getStatus()) {
      const { default: PhotoModel } = await import('../models/Photo.js');
      const q = albumSlug && albumSlug !== 'all' ? { albumSlug } : {};
      return PhotoModel.find(q).sort({ createdAt: -1 });
    }
    const db = initLocalStore();
    const photos = db.photos || [];
    return albumSlug && albumSlug !== 'all' ? photos.filter(p => p.albumSlug === albumSlug) : photos;
  },

  createPhoto: async (data) => {
    if (getStatus()) {
      const { default: PhotoModel } = await import('../models/Photo.js');
      return PhotoModel.create(data);
    }
    const db = initLocalStore();
    const p = { _id: `photo_${Date.now()}`, createdAt: new Date().toISOString(), ...data };
    db.photos = [p, ...(db.photos || [])]; saveLocalStore(); return p;
  },

  deletePhoto: async (id) => {
    if (getStatus()) {
      const { default: PhotoModel } = await import('../models/Photo.js');
      return PhotoModel.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const i = (db.photos || []).findIndex(p => p._id === id);
    if (i === -1) return null;
    const [d] = db.photos.splice(i, 1); saveLocalStore(); return d;
  },

  // Locations
  getLocations: async () => {
    if (getStatus()) {
      const { default: LocationModel } = await import('../models/Location.js');
      return LocationModel.find().sort({ visitedDate: -1 });
    }
    return (initLocalStore().locations || []);
  },

  createLocation: async (data) => {
    if (getStatus()) {
      const { default: LocationModel } = await import('../models/Location.js');
      return LocationModel.create(data);
    }
    const db = initLocalStore();
    const l = { _id: `loc_${Date.now()}`, createdAt: new Date().toISOString(), ...data };
    db.locations = [...(db.locations || []), l]; saveLocalStore(); return l;
  },

  updateLocation: async (id, data) => {
    if (getStatus()) {
      const { default: LocationModel } = await import('../models/Location.js');
      return LocationModel.findByIdAndUpdate(id, data, { new: true });
    }
    const db = initLocalStore();
    const i = (db.locations || []).findIndex(l => l._id === id);
    if (i === -1) return null;
    db.locations[i] = { ...db.locations[i], ...data }; saveLocalStore(); return db.locations[i];
  },

  deleteLocation: async (id) => {
    if (getStatus()) {
      const { default: LocationModel } = await import('../models/Location.js');
      return LocationModel.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const i = (db.locations || []).findIndex(l => l._id === id);
    if (i === -1) return null;
    const [d] = db.locations.splice(i, 1); saveLocalStore(); return d;
  },

  // Contact Messages
  getContactMessages: async () => {
    if (getStatus()) {
      const { default: CMModel } = await import('../models/ContactMessage.js');
      return CMModel.find().sort({ createdAt: -1 });
    }
    return (initLocalStore().messages || []);
  },

  createContactMessage: async (data) => {
    if (getStatus()) {
      const { default: CMModel } = await import('../models/ContactMessage.js');
      return CMModel.create(data);
    }
    const db = initLocalStore();
    const m = { _id: `msg_${Date.now()}`, isRead: false, createdAt: new Date().toISOString(), ...data };
    db.messages = [m, ...(db.messages || [])]; saveLocalStore(); return m;
  },

  toggleMessageRead: async (id) => {
    if (getStatus()) {
      const { default: CMModel } = await import('../models/ContactMessage.js');
      const msg = await CMModel.findById(id);
      if (!msg) return null;
      msg.isRead = !msg.isRead; await msg.save(); return msg;
    }
    const db = initLocalStore();
    const msg = (db.messages || []).find(m => m._id === id);
    if (!msg) return null;
    msg.isRead = !msg.isRead; saveLocalStore(); return msg;
  },

  deleteContactMessage: async (id) => {
    if (getStatus()) {
      const { default: CMModel } = await import('../models/ContactMessage.js');
      return CMModel.findByIdAndDelete(id);
    }
    const db = initLocalStore();
    const i = (db.messages || []).findIndex(m => m._id === id);
    if (i === -1) return null;
    const [d] = db.messages.splice(i, 1); saveLocalStore(); return d;
  },

  // Newsletter
  addSubscriber: async (email) => {
    if (getStatus()) {
      const { default: NSModel } = await import('../models/NewsletterSubscriber.js');
      const exists = await NSModel.findOne({ email });
      if (exists) return exists;
      return NSModel.create({ email });
    }
    const db = initLocalStore();
    const exists = (db.subscribers || []).find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;
    const s = { _id: `sub_${Date.now()}`, email, isActive: true, subscribedAt: new Date().toISOString() };
    db.subscribers = [...(db.subscribers || []), s]; saveLocalStore(); return s;
  },

  getSubscribers: async () => {
    if (getStatus()) {
      const { default: NSModel } = await import('../models/NewsletterSubscriber.js');
      return NSModel.find().sort({ subscribedAt: -1 });
    }
    return (initLocalStore().subscribers || []);
  },

  // Settings
  getSettings: async () => {
    if (getStatus()) {
      const { default: SSModel } = await import('../models/SiteSettings.js');
      let s = await SSModel.findOne();
      if (!s) s = await SSModel.create({ channelName: 'Palu Vlogs' });
      return s;
    }
    return initLocalStore().settings;
  },

  updateSettings: async (data) => {
    if (getStatus()) {
      const { default: SSModel } = await import('../models/SiteSettings.js');
      let s = await SSModel.findOne();
      if (!s) return SSModel.create(data);
      Object.assign(s, data); s.updatedAt = Date.now(); return s.save();
    }
    const db = initLocalStore();
    db.settings = { ...db.settings, ...data, updatedAt: new Date().toISOString() };
    saveLocalStore(); return db.settings;
  },

  getStats: async () => {
    const [vlogs, photos, locations, messages, subscribers] = await Promise.all([
      dataStore.getVlogs(), dataStore.getPhotos(), dataStore.getLocations(),
      dataStore.getContactMessages(), dataStore.getSubscribers()
    ]);
    return {
      totalVlogs: vlogs.length, totalPhotos: photos.length,
      totalLocations: locations.length, totalMessages: messages.length,
      unreadMessages: messages.filter(m => !m.isRead).length,
      totalSubscribers: subscribers.length,
      totalViews: vlogs.reduce((acc, v) => acc + (v.views || 0), 0)
    };
  }
};

// Initialize on import
initLocalStore();

export default dataStore;
