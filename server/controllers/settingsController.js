const dataStore = require('../services/dataStore');

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    const settings = await dataStore.getSettings();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    const updated = await dataStore.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/settings/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const stats = await dataStore.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getStats
};
