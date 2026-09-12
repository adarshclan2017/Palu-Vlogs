const dataStore = require('../services/dataStore');

// @desc    Get all photos (optional filter by album)
// @route   GET /api/gallery
// @access  Public
const getPhotos = async (req, res, next) => {
  try {
    const { album } = req.query;
    const photos = await dataStore.getPhotos({ albumSlug: album });
    const albums = await dataStore.getAlbums();

    res.status(200).json({
      success: true,
      count: photos.length,
      albums,
      data: photos
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all albums
// @route   GET /api/gallery/albums
// @access  Public
const getAlbums = async (req, res, next) => {
  try {
    const albums = await dataStore.getAlbums();
    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload / Add new photo
// @route   POST /api/gallery
// @access  Private (Admin)
const createPhoto = async (req, res, next) => {
  try {
    const { title, caption, albumSlug, location, date, isFeatured, imageUrl } = req.body;

    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and Image are required'
      });
    }

    const newPhoto = await dataStore.createPhoto({
      title,
      caption: caption || '',
      imageUrl: finalImageUrl,
      albumSlug: albumSlug || 'season-2-road-trips',
      location: location || 'Kerala',
      date: date || new Date().getFullYear().toString(),
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      message: 'Photo added to gallery!',
      data: newPhoto
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete photo
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deletePhoto(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPhotos,
  getAlbums,
  createPhoto,
  deletePhoto
};
