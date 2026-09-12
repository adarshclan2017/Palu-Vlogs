const express = require('express');
const router = express.Router();
const {
  getVlogs,
  getVlogBySlug,
  createVlog,
  updateVlog,
  deleteVlog
} = require('../controllers/vlogController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getVlogs)
  .post(protect, authorize('admin'), createVlog);

router.route('/:slug')
  .get(getVlogBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateVlog)
  .delete(protect, authorize('admin'), deleteVlog);

module.exports = router;
