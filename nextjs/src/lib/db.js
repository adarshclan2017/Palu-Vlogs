import mongoose from 'mongoose';

const ATLAS_URI = 'mongodb+srv://adarshclan2017_db_user:uVLJhjR3gGURRPnc@cluster0.mov2h9n.mongodb.net/paluvlogs?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_URI;

// Critical for serverless: never buffer queries when disconnected
mongoose.set('bufferCommands', false);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(timeoutMs = 2500) {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: timeoutMs,
        connectTimeoutMS: timeoutMs,
        socketTimeoutMS: 5000,
        bufferCommands: false,
      })
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        console.warn('[MongoDB] Connection failed:', err.message);
        cached.promise = null;
        cached.conn = null;
        return null;
      });
  }

  const timer = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs));

  const result = await Promise.race([cached.promise, timer]);
  if (!result) {
    cached.promise = null;
    cached.conn = null;
  }
  return result;
}

export function getStatus() {
  return mongoose.connection.readyState === 1;
}
