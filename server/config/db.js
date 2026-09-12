const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paluvlogs';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to local/remote MongoDB (${error.message}).`);
    console.log('[MongoDB] Running in Mock/In-Memory Mode for offline development.');
    isConnected = false;
    return null;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
