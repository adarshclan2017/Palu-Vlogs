require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & uploaded images
app.use('/assets/images', express.static(path.join(__dirname, '../assets/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vlogs', require('./routes/vlogRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Palu Vlogs MERN API',
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Palu Vlogs Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`⚙️  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Error: ${err.message}`);
});

module.exports = { app, server };
