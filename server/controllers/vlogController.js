const dataStore = require('../services/dataStore');
const { extractYouTubeId, getYouTubeThumbnail, slugify } = require('../utils/youtubeHelper');

// @desc    Get all vlogs with filters
// @route   GET /api/vlogs
// @access  Public
const getVlogs = async (req, res, next) => {
  try {
    const { search, category, tag, sort, page = 1, limit = 12 } = req.query;

    const allVlogs = await dataStore.getVlogs({
      search,
      category,
      tag,
      sort
    });

    // Pagination
    const total = allVlogs.length;
    const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const endIndex = startIndex + parseInt(limit, 10);
    const vlogs = allVlogs.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: vlogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page, 10),
      data: vlogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vlog by slug
// @route   GET /api/vlogs/:slug
// @access  Public
const getVlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const vlog = await dataStore.getVlogBySlug(slug);

    if (!vlog) {
      return res.status(404).json({
        success: false,
        message: 'Vlog not found'
      });
    }

    // Increment view count in background
    dataStore.incrementVlogViews(vlog._id || vlog.slug).catch(() => {});

    // Fetch related vlogs (same category, different slug)
    const allVlogs = await dataStore.getVlogs({ category: vlog.category });
    const related = allVlogs
      .filter(v => v.slug !== vlog.slug)
      .slice(0, 3);

    res.status(200).json({
      success: true,
      data: vlog,
      related
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new vlog
// @route   POST /api/vlogs
// @access  Private (Admin)
const createVlog = async (req, res, next) => {
  try {
    const {
      title,
      description,
      youtubeUrl,
      category,
      tags,
      locationName,
      duration,
      isFeatured,
      isPopular,
      customThumbnail
    } = req.body;

    if (!title || !description || !youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and YouTube URL are required'
      });
    }

    // Extract YouTube ID
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL or Video ID'
      });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await dataStore.getVlogBySlug(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Determine thumbnail
    const thumbnailUrl = customThumbnail || getYouTubeThumbnail(youtubeId);

    // Format tags
    const formattedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const newVlog = await dataStore.createVlog({
      title,
      slug,
      description,
      youtubeUrl,
      youtubeId,
      thumbnailUrl,
      duration: duration || '18:00',
      category: category || 'Road Trips',
      tags: formattedTags,
      locationName: locationName || 'Kerala, India',
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular),
      publishedAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Vlog created successfully!',
      data: newVlog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update vlog
// @route   PUT /api/vlogs/:id
// @access  Private (Admin)
const updateVlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If YouTube URL is updated, re-extract ID and thumbnail
    if (updateData.youtubeUrl) {
      const youtubeId = extractYouTubeId(updateData.youtubeUrl);
      if (youtubeId) {
        updateData.youtubeId = youtubeId;
        if (!updateData.thumbnailUrl) {
          updateData.thumbnailUrl = getYouTubeThumbnail(youtubeId);
        }
      }
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updated = await dataStore.updateVlog(id, updateData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Vlog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vlog updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete vlog
// @route   DELETE /api/vlogs/:id
// @access  Private (Admin)
const deleteVlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteVlog(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Vlog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vlog deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVlogs,
  getVlogBySlug,
  createVlog,
  updateVlog,
  deleteVlog
};
