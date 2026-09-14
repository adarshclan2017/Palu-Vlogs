const multer = require('multer');
const path = require('path');
const fs = require('fs');

// In serverless environments like Vercel, the filesystem is read-only except /tmp
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Upload] Notice creating directory:', err.message);
}

// Storage engine - memoryStorage for serverless fallback
const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'palu-' + uniqueSuffix + ext);
      }
    });

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const ext = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedExtensions.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload;
