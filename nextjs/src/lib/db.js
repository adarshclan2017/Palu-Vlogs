import mongoose from 'mongoose';

const ATLAS_URI = 'mongodb+srv://adarshclan2017_db_user:uVLJhjR3gGURRPnc@cluster0.mov2h9n.mongodb.net/paluvlogs?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then((m) => m)
      .catch((err) => {
        console.warn('[MongoDB] Connection failed:', err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.conn = null;
    throw e;
  }
}

export function getStatus() {
  return mongoose.connection.readyState === 1;
}
