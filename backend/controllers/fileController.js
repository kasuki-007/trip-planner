const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const cloudinary = require('../config/cloudinary');
const File = require('../models/File');
const streamifier = require('streamifier');

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

exports.getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ trip: req.params.tripId })
    .populate('uploadedBy', 'name email avatar')
    .sort({ createdAt: -1 });

  successResponse(res, 200, 'Files fetched', files, { count: files.length });
});

exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return errorResponse(res, 400, 'No file uploaded');

  const { originalname, buffer, mimetype, size } = req.file;

  const result = await uploadToCloudinary(buffer, {
    folder: `tripsync/${req.params.tripId}`,
    resource_type: 'auto',
    public_id: `${Date.now()}-${originalname.replace(/\s+/g, '_')}`,
  });

  let fileType = 'other';
  if (mimetype.startsWith('image/')) fileType = 'image';
  else if (mimetype === 'application/pdf') fileType = 'pdf';

  const file = await File.create({
    trip: req.params.tripId,
    uploadedBy: req.user._id,
    name: originalname,
    url: result.secure_url,
    publicId: result.public_id,
    type: fileType,
    size,
  });

  await file.populate('uploadedBy', 'name email avatar');
  successResponse(res, 201, 'File uploaded', file);
});

exports.downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.fileId, trip: req.params.tripId });
  if (!file) return errorResponse(res, 404, 'File not found');

  const axios = require('axios');
  try {
    const upstream = await axios.get(file.url, {
      responseType: 'stream',
      maxRedirects: 5,
      headers: { 'User-Agent': 'TripSync/1.0' },
    });
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Content-Type', upstream.headers['content-type'] || 'application/octet-stream');
    if (upstream.headers['content-length']) {
      res.setHeader('Content-Length', upstream.headers['content-length']);
    }
    upstream.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err.response?.status, err.response?.data || err.message);
    errorResponse(res, 502, 'Failed to download file');
  }
});

exports.deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.fileId, trip: req.params.tripId });
  if (!file) return errorResponse(res, 404, 'File not found');

  const isUploader = file.uploadedBy.toString() === req.user._id.toString();
  const isOwner = req.userRole === 'owner';
  if (!isUploader && !isOwner) {
    return errorResponse(res, 403, 'Only the uploader or trip owner can delete this file');
  }

  await cloudinary.uploader.destroy(file.publicId, { resource_type: 'auto' });

  await file.deleteOne();
  successResponse(res, 200, 'File deleted');
});
