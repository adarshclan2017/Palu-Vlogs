const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file'
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
