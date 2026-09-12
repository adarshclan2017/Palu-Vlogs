const dataStore = require('../services/dataStore');

// @desc    Get all locations / adventures
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res, next) => {
  try {
    const locations = await dataStore.getLocations();
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create location
// @route   POST /api/locations
// @access  Private (Admin)
const createLocation = async (req, res, next) => {
  try {
    const { name, state, country, description, coverImage, lat, lng, visitedDate } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    let finalCover = coverImage;
    if (req.file) {
      finalCover = `/uploads/${req.file.filename}`;
    }

    const newLoc = await dataStore.createLocation({
      name,
      state: state || 'Kerala',
      country: country || 'India',
      description,
      coverImage: finalCover || '/assets/images/about_roadtrip.jpg',
      coordinates: {
        lat: parseFloat(lat) || 10.0,
        lng: parseFloat(lng) || 76.5
      },
      visitedDate: visitedDate || '2026'
    });

    res.status(201).json({
      success: true,
      message: 'Location added successfully!',
      data: newLoc
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (updateData.lat || updateData.lng) {
      updateData.coordinates = {
        lat: parseFloat(updateData.lat) || 10.0,
        lng: parseFloat(updateData.lng) || 76.5
      };
    }

    const updated = await dataStore.updateLocation(id, updateData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteLocation(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
