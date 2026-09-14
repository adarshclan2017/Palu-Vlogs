require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, getStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & uploaded images safely
const imagesDir = path.join(__dirname, '../assets/images');
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (fs.existsSync(imagesDir)) {
    app.use('/assets/images', express.static(imagesDir));
  }
  if (fs.existsSync(uploadsDir)) {
    app.use('/uploads', express.static(uploadsDir));
  }
} catch (e) {
  // Ignore filesystem check errors on serverless
}

// Favicon handler to prevent 500/ENOENT errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root endpoint: displays status, API health, and available routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Palu Vlogs Server API',
    version: '1.0.0',
    database: getStatus() ? 'connected' : 'mock/offline',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      vlogs: '/api/vlogs',
      gallery: '/api/gallery',
      locations: '/api/locations',
      contact: '/api/contact',
      newsletter: '/api/newsletter',
      settings: '/api/settings',
      auth: '/api/auth'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Palu Vlogs MERN API',
    database: getStatus() ? 'connected' : 'mock/offline',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vlogs', require('./routes/vlogRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server = null;

// Only spin up local HTTP listener if not executing inside Vercel serverless functions
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Palu Vlogs Server running on port ${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`⚙️  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Error: ${err.message}`);
});

module.exports = app;
module.exports.app = app;
module.exports.server = server;
