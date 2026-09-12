const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  toggleReadStatus,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(sendMessage)
  .get(protect, authorize('admin'), getMessages);

router.route('/:id/read')
  .put(protect, authorize('admin'), toggleReadStatus);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteMessage);

module.exports = router;
