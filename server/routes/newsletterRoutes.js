const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/subscribe', subscribe);
router.get('/subscribers', protect, authorize('admin'), getSubscribers);

module.exports = router;
