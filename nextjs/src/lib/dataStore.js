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

export const isObjectId = (id) => {
  if (!id) return false;
  const str = typeof id === 'object' && id._id ? id._id.toString() : id.toString();
  return /^[0-9a-fA-F]{24}$/.test(str);
};

export const dataStore = {
  isMongoActive: () => getStatus(),

  // Users
  getUserByEmail: async (email) => {
    const clean = (email || '').trim().toLowerCase();
    if (getStatus()) {
      try {
        const { default: UserModel } = await import('../models/User.js');
        const user = await UserModel.findOne({ email: clean }).select('+password');
        if (user) return user;
      } catch (err) {
        console.warn('getUserByEmail mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    return db.users.find(u => u.email.toLowerCase() === clean) || null;
  },

  getUserById: async (id) => {
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: UserModel } = await import('../models/User.js');
        const user = await UserModel.findById(id);
        if (user) return user;
      } catch (err) {
        console.warn('getUserById mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const user = db.users.find(u => u._id === id || (u._id && u._id.toString() === id?.toString()));
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  // Vlogs
  getVlogs: async ({ search, category, tag, sort } = {}) => {
    if (getStatus()) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        let query = {};
        if (category && category !== 'all') query.category = category;
        if (tag) query.tags = tag;
        if (search) query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
        const docs = await VlogModel.find(query).sort({ publishedAt: -1 });
        if (docs && (docs.length > 0 || search || (category && category !== 'all') || tag)) {
          return docs;
        }
      } catch (err) {
        console.warn('getVlogs mongo error:', err.message);
      }
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
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        let v = await VlogModel.findOne({ slug });
        if (!v && isObjectId(slug)) {
          v = await VlogModel.findById(slug);
        }
        if (v) return v;
      } catch (err) {
        console.warn('getVlogBySlug mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    return db.vlogs?.find(v => v.slug === slug || v._id === slug) || null;
  },

  createVlog: async (data) => {
    let created = null;
    const mongoData = { ...data };
    if (mongoData.location && !isObjectId(mongoData.location)) {
      delete mongoData.location;
    }
    if (getStatus()) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        created = await VlogModel.create(mongoData);
      } catch (err) {
        console.warn('createVlog mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const v = created
      ? JSON.parse(JSON.stringify(created))
      : { _id: `vlog_${Date.now()}`, views: 0, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(), ...data };
    db.vlogs = [v, ...(db.vlogs || []).filter(item => item._id !== v._id && item.slug !== v.slug)];
    saveLocalStore();
    return created || v;
  },

  updateVlog: async (id, data) => {
    const mongoData = { ...data };
    if (mongoData.location && !isObjectId(mongoData.location)) {
      delete mongoData.location;
    }

    if (getStatus() && isObjectId(id)) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        const updated = await VlogModel.findByIdAndUpdate(id, mongoData, { new: true });
        if (updated) {
          const db = initLocalStore();
          const i = (db.vlogs || []).findIndex(v => v._id === id || v.slug === updated.slug);
          if (i !== -1) {
            db.vlogs[i] = { ...db.vlogs[i], ...data };
            saveLocalStore();
          }
          return updated;
        }
      } catch (err) {
        console.warn('updateVlog mongo error:', err.message);
      }
    }

    const db = initLocalStore();
    const i = (db.vlogs || []).findIndex(v => v._id === id || v.slug === id);
    if (i !== -1) {
      const prevSlug = db.vlogs[i].slug;
      db.vlogs[i] = { ...db.vlogs[i], ...data };
      saveLocalStore();

      if (getStatus()) {
        try {
          const { default: VlogModel } = await import('../models/Vlog.js');
          const targetSlug = data.slug || prevSlug;
          if (targetSlug) {
            await VlogModel.findOneAndUpdate(
              { slug: targetSlug },
              mongoData,
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          }
        } catch (e) {
          console.warn('Sync vlog to mongo failed:', e.message);
        }
      }
      return db.vlogs[i];
    }

    if (getStatus() && data.slug) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        const updated = await VlogModel.findOneAndUpdate({ slug: data.slug }, mongoData, { new: true });
        if (updated) return updated;
      } catch {}
    }
    return null;
  },

  deleteVlog: async (id) => {
    let deleted = null;
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        deleted = await VlogModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('deleteVlog mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const i = (db.vlogs || []).findIndex(v => v._id === id || v.slug === id);
    if (i !== -1) {
      const [d] = db.vlogs.splice(i, 1);
      saveLocalStore();
      if (getStatus() && d.slug) {
        try {
          const { default: VlogModel } = await import('../models/Vlog.js');
          await VlogModel.deleteOne({ slug: d.slug });
        } catch {}
      }
      return deleted || d;
    }
    return deleted;
  },

  incrementVlogViews: async (id) => {
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        return await VlogModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
      } catch {}
    }
    if (getStatus()) {
      try {
        const { default: VlogModel } = await import('../models/Vlog.js');
        const res = await VlogModel.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true });
        if (res) return res;
      } catch {}
    }
    const db = initLocalStore();
    const v = db.vlogs?.find(v => v._id === id || v.slug === id);
    if (v) {
      v.views = (v.views || 0) + 1;
      saveLocalStore();
      return v;
    }
  },

  // Gallery
  getAlbums: async () => {
    if (getStatus()) {
      try {
        const { default: AlbumModel } = await import('../models/Album.js');
        const docs = await AlbumModel.find();
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('getAlbums mongo error:', err.message);
      }
    }
    return (initLocalStore().albums || []);
  },

  getPhotos: async ({ albumSlug } = {}) => {
    if (getStatus()) {
      try {
        const { default: PhotoModel } = await import('../models/Photo.js');
        const q = albumSlug && albumSlug !== 'all' ? { albumSlug } : {};
        const docs = await PhotoModel.find(q).sort({ createdAt: -1 });
        if (docs && (docs.length > 0 || (albumSlug && albumSlug !== 'all'))) return docs;
      } catch (err) {
        console.warn('getPhotos mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const photos = db.photos || [];
    return albumSlug && albumSlug !== 'all' ? photos.filter(p => p.albumSlug === albumSlug) : photos;
  },

  createPhoto: async (data) => {
    let created = null;
    const mongoData = { ...data };
    if (mongoData.album && !isObjectId(mongoData.album)) {
      delete mongoData.album;
    }
    if (getStatus()) {
      try {
        const { default: PhotoModel } = await import('../models/Photo.js');
        created = await PhotoModel.create(mongoData);
      } catch (err) {
        console.warn('createPhoto mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const p = created
      ? JSON.parse(JSON.stringify(created))
      : { _id: `photo_${Date.now()}`, createdAt: new Date().toISOString(), ...data };
    db.photos = [p, ...(db.photos || []).filter(item => item._id !== p._id)];
    saveLocalStore();
    return created || p;
  },

  deletePhoto: async (id) => {
    let deleted = null;
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: PhotoModel } = await import('../models/Photo.js');
        deleted = await PhotoModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('deletePhoto mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const i = (db.photos || []).findIndex(p => p._id === id);
    if (i !== -1) {
      const [d] = db.photos.splice(i, 1);
      saveLocalStore();
      if (getStatus() && d.title) {
        try {
          const { default: PhotoModel } = await import('../models/Photo.js');
          await PhotoModel.deleteOne({ title: d.title });
        } catch {}
      }
      return deleted || d;
    }
    return deleted;
  },

  updatePhoto: async (id, data) => {
    const mongoData = { ...data };
    if (mongoData.album && !isObjectId(mongoData.album)) {
      delete mongoData.album;
    }

    if (getStatus() && isObjectId(id)) {
      try {
        const { default: PhotoModel } = await import('../models/Photo.js');
        const updated = await PhotoModel.findByIdAndUpdate(id, mongoData, { new: true });
        if (updated) {
          const db = initLocalStore();
          const i = (db.photos || []).findIndex(p => p._id === id);
          if (i !== -1) {
            db.photos[i] = { ...db.photos[i], ...data };
            saveLocalStore();
          }
          return updated;
        }
      } catch (err) {
        console.warn('updatePhoto mongo error:', err.message);
      }
    }

    const db = initLocalStore();
    const i = (db.photos || []).findIndex(p => p._id === id);
    if (i !== -1) {
      db.photos[i] = { ...db.photos[i], ...data };
      saveLocalStore();
      if (getStatus() && db.photos[i].title) {
        try {
          const { default: PhotoModel } = await import('../models/Photo.js');
          await PhotoModel.findOneAndUpdate(
            { title: db.photos[i].title },
            mongoData,
            { upsert: true, new: true }
          );
        } catch {}
      }
      return db.photos[i];
    }
    return null;
  },

  // Locations
  getLocations: async () => {
    if (getStatus()) {
      try {
        const { default: LocationModel } = await import('../models/Location.js');
        const docs = await LocationModel.find().sort({ visitedDate: -1 });
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('getLocations mongo error:', err.message);
      }
    }
    return (initLocalStore().locations || []);
  },

  createLocation: async (data) => {
    let created = null;
    const mongoData = { ...data };
    if (Array.isArray(mongoData.vlogs)) {
      mongoData.vlogs = mongoData.vlogs.filter(v => isObjectId(v));
    }
    if (getStatus()) {
      try {
        const { default: LocationModel } = await import('../models/Location.js');
        created = await LocationModel.create(mongoData);
      } catch (err) {
        console.warn('createLocation mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const l = created
      ? JSON.parse(JSON.stringify(created))
      : { _id: `loc_${Date.now()}`, createdAt: new Date().toISOString(), ...data };
    db.locations = [...(db.locations || []).filter(item => item._id !== l._id), l];
    saveLocalStore();
    return created || l;
  },

  updateLocation: async (id, data) => {
    const mongoData = { ...data };
    if (Array.isArray(mongoData.vlogs)) {
      mongoData.vlogs = mongoData.vlogs.filter(v => isObjectId(v));
    }

    // 1. If valid 24-hex ObjectId, try MongoDB directly
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: LocationModel } = await import('../models/Location.js');
        const updated = await LocationModel.findByIdAndUpdate(id, mongoData, { new: true });
        if (updated) {
          const db = initLocalStore();
          const i = (db.locations || []).findIndex(l => l._id === id || l._id?.toString() === id.toString() || l.name === updated.name);
          if (i !== -1) {
            db.locations[i] = { ...db.locations[i], ...data };
            saveLocalStore();
          }
          return updated;
        }
      } catch (err) {
        console.warn('updateLocation mongo error:', err.message);
      }
    }

    // 2. Not an ObjectId (e.g. 'loc_1') or not found by ObjectId in Mongo: update local store & sync to Mongo by name
    const db = initLocalStore();
    const i = (db.locations || []).findIndex(l => l._id === id || l._id?.toString() === id?.toString());
    if (i !== -1) {
      const prevName = db.locations[i].name;
      db.locations[i] = { ...db.locations[i], ...data };
      saveLocalStore();

      if (getStatus()) {
        try {
          const { default: LocationModel } = await import('../models/Location.js');
          const targetName = data.name || prevName;
          await LocationModel.findOneAndUpdate(
            { name: { $regex: new RegExp(`^${targetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
            { ...mongoData, name: targetName },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (e) {
          console.warn('Sync location to mongo failed:', e.message);
        }
      }
      return db.locations[i];
    }

    // 3. If not in local store, try finding by name in MongoDB
    if (getStatus() && data.name) {
      try {
        const { default: LocationModel } = await import('../models/Location.js');
        const updated = await LocationModel.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          mongoData,
          { new: true }
        );
        if (updated) return updated;
      } catch {}
    }
    return null;
  },

  deleteLocation: async (id) => {
    let deleted = null;
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: LocationModel } = await import('../models/Location.js');
        deleted = await LocationModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('deleteLocation mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const i = (db.locations || []).findIndex(l => l._id === id || l._id?.toString() === id?.toString());
    if (i !== -1) {
      const [d] = db.locations.splice(i, 1);
      saveLocalStore();
      if (getStatus() && d.name) {
        try {
          const { default: LocationModel } = await import('../models/Location.js');
          await LocationModel.deleteOne({ name: { $regex: new RegExp(`^${d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
        } catch {}
      }
      return deleted || d;
    }
    return deleted;
  },

  // Contact Messages
  getContactMessages: async () => {
    if (getStatus()) {
      try {
        const { default: CMModel } = await import('../models/ContactMessage.js');
        const docs = await CMModel.find().sort({ createdAt: -1 });
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('getContactMessages mongo error:', err.message);
      }
    }
    return (initLocalStore().messages || []);
  },

  createContactMessage: async (data) => {
    let created = null;
    if (getStatus()) {
      try {
        const { default: CMModel } = await import('../models/ContactMessage.js');
        created = await CMModel.create(data);
      } catch (err) {
        console.warn('createContactMessage mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const m = created
      ? JSON.parse(JSON.stringify(created))
      : { _id: `msg_${Date.now()}`, isRead: false, createdAt: new Date().toISOString(), ...data };
    db.messages = [m, ...(db.messages || []).filter(item => item._id !== m._id)];
    saveLocalStore();
    return created || m;
  },

  toggleMessageRead: async (id) => {
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: CMModel } = await import('../models/ContactMessage.js');
        const msg = await CMModel.findById(id);
        if (msg) {
          msg.isRead = !msg.isRead;
          await msg.save();
          const db = initLocalStore();
          const local = (db.messages || []).find(m => m._id === id || m._id?.toString() === id.toString());
          if (local) {
            local.isRead = msg.isRead;
            saveLocalStore();
          }
          return msg;
        }
      } catch (err) {
        console.warn('toggleMessageRead mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const msg = (db.messages || []).find(m => m._id === id || m._id?.toString() === id?.toString());
    if (!msg) return null;
    msg.isRead = !msg.isRead;
    saveLocalStore();
    return msg;
  },

  markAllMessagesAsRead: async () => {
    if (getStatus()) {
      try {
        const { default: CMModel } = await import('../models/ContactMessage.js');
        await CMModel.updateMany({ isRead: false }, { $set: { isRead: true } });
      } catch (err) {
        console.warn('markAllMessagesAsRead mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    (db.messages || []).forEach(m => { m.isRead = true; });
    saveLocalStore();
    return true;
  },

  deleteContactMessage: async (id) => {
    let deleted = null;
    if (getStatus() && isObjectId(id)) {
      try {
        const { default: CMModel } = await import('../models/ContactMessage.js');
        deleted = await CMModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('deleteContactMessage mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const i = (db.messages || []).findIndex(m => m._id === id || m._id?.toString() === id?.toString());
    if (i !== -1) {
      const [d] = db.messages.splice(i, 1);
      saveLocalStore();
      return deleted || d;
    }
    return deleted;
  },

  // Newsletter
  addSubscriber: async (email) => {
    if (getStatus()) {
      try {
        const { default: NSModel } = await import('../models/NewsletterSubscriber.js');
        const exists = await NSModel.findOne({ email });
        if (exists) return exists;
        const created = await NSModel.create({ email });
        const db = initLocalStore();
        if (!db.subscribers) db.subscribers = [];
        db.subscribers.push(JSON.parse(JSON.stringify(created)));
        saveLocalStore();
        return created;
      } catch (err) {
        console.warn('addSubscriber mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    const exists = (db.subscribers || []).find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;
    const s = { _id: `sub_${Date.now()}`, email, isActive: true, subscribedAt: new Date().toISOString() };
    db.subscribers = [...(db.subscribers || []), s];
    saveLocalStore();
    return s;
  },

  getSubscribers: async () => {
    if (getStatus()) {
      try {
        const { default: NSModel } = await import('../models/NewsletterSubscriber.js');
        const docs = await NSModel.find().sort({ subscribedAt: -1 });
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('getSubscribers mongo error:', err.message);
      }
    }
    return (initLocalStore().subscribers || []);
  },

  // Settings
  getSettings: async () => {
    if (getStatus()) {
      try {
        const { default: SSModel } = await import('../models/SiteSettings.js');
        let s = await SSModel.findOne();
        if (s) return s;
      } catch (err) {
        console.warn('getSettings mongo error:', err.message);
      }
    }
    return initLocalStore().settings;
  },

  updateSettings: async (data) => {
    if (getStatus()) {
      try {
        const { default: SSModel } = await import('../models/SiteSettings.js');
        const updated = await SSModel.findOneAndUpdate(
          {},
          { $set: data, updatedAt: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (updated) {
          const db = initLocalStore();
          db.settings = { ...db.settings, ...data, updatedAt: new Date().toISOString() };
          saveLocalStore();
          return updated;
        }
      } catch (err) {
        console.warn('updateSettings mongo error:', err.message);
      }
    }
    const db = initLocalStore();
    db.settings = { ...db.settings, ...data, updatedAt: new Date().toISOString() };
    saveLocalStore();
    return db.settings;
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
