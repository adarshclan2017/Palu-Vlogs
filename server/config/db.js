const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let isConnected = false;

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    isConnected = true;
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paluvlogs';

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    }).then((conn) => {
      isConnected = true;
      const host = conn.connection.host || conn.connection.name || 'MongoDB Atlas';
      console.log(`[MongoDB] Connected: ${host}`);
      return conn;
    }).catch((error) => {
      console.warn(`[MongoDB Warning] Could not connect to local/remote MongoDB (${error.message}).`);
      console.log('[MongoDB] Running in Mock/In-Memory Mode for offline development.');
      isConnected = false;
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    isConnected = false;
    return null;
  }
};

const getStatus = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getStatus };
