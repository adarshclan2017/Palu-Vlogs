const dataStore = require('../services/dataStore');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const sub = await dataStore.addSubscriber(email.trim().toLowerCase());

    res.status(201).json({
      success: true,
      message: 'Thanks for subscribing! You will receive episode alerts.',
      data: sub
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private (Admin)
const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await dataStore.getSubscribers();
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribe, getSubscribers };
