const express = require('express');
const router = express.Router();
const {
  getPhotos,
  getAlbums,
  createPhoto,
  deletePhoto
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/albums', getAlbums);

router.route('/')
  .get(getPhotos)
  .post(protect, authorize('admin'), upload.single('image'), createPhoto);

router.route('/:id')
  .delete(protect, authorize('admin'), deletePhoto);

module.exports = router;
