const express = require('express');
const router = express.Router();
const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getLocations)
  .post(protect, authorize('admin'), upload.single('coverImage'), createLocation);

router.route('/:id')
  .put(protect, authorize('admin'), upload.single('coverImage'), updateLocation)
  .delete(protect, authorize('admin'), deleteLocation);

module.exports = router;
