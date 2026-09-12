const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { connectDB, getStatus } = require('../config/db');
const User = require('../models/User');
const Vlog = require('../models/Vlog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Photo = require('../models/Photo');
const Album = require('../models/Album');
const Location = require('../models/Location');
const ContactMessage = require('../models/ContactMessage');
const SiteSettings = require('../models/SiteSettings');
const seedData = require('./seedData');

const seedDatabase = async () => {
  console.log('Connecting to database...');
  await connectDB();

  if (getStatus()) {
    console.log('Clearing existing MongoDB collections...');
    await User.deleteMany();
    await Vlog.deleteMany();
    await Category.deleteMany();
    await Tag.deleteMany();
    await Photo.deleteMany();
    await Album.deleteMany();
    await Location.deleteMany();
    await ContactMessage.deleteMany();
    await SiteSettings.deleteMany();

    console.log('Seeding admin user...');
    await User.create({
      name: 'Palu Vlogs Admin',
      email: 'admin@paluvlogs.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: '/assets/images/logo.jpg'
    });

    console.log('Seeding categories, tags, albums, locations...');
    await Category.insertMany(seedData.categories);
    await Tag.insertMany(seedData.tags);
    await Album.insertMany(seedData.albums);
    await Location.insertMany(seedData.locations);

    console.log('Seeding vlogs...');
    await Vlog.insertMany(seedData.vlogs);

    console.log('Seeding gallery photos...');
    await Photo.insertMany(seedData.photos);

    console.log('Seeding contact messages...');
    await ContactMessage.insertMany(seedData.initialMessages);

    console.log('Seeding site settings...');
    await SiteSettings.create(seedData.siteSettings);

    console.log('✅ MongoDB Database seeded successfully!');
  } else {
    console.log('Running in local store mode. Initializing local database...');
    require('../services/dataStore');
    console.log('✅ Local store initialized with seed data!');
  }

  process.exit(0);
};

seedDatabase().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
