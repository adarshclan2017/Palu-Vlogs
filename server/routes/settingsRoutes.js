const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getStats } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSettings);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;
