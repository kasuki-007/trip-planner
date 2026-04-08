const multer = require('multer');
const { errorResponse } = require('../utils/apiResponse');

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: images and PDF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * Multer error handler — converts Multer errors to consistent API responses.
 */
const handleUploadError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return errorResponse(res, 400, `Upload error: ${err.message}`);
  }
  if (err) {
    return errorResponse(res, 400, err.message);
  }
  next();
};

module.exports = { upload, handleUploadError };
