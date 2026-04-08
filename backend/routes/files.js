const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const { upload, handleUploadError } = require('../middleware/upload');
const { getFiles, uploadFile, deleteFile, downloadFile } = require('../controllers/fileController');

const member = checkRole(['owner', 'editor', 'viewer']);
const editor = checkRole(['owner', 'editor']);

router.get('/', verifyToken, member, getFiles);
router.get('/:fileId/download', verifyToken, member, downloadFile);
router.post('/', verifyToken, editor, upload.single('file'), handleUploadError, uploadFile);
router.delete('/:fileId', verifyToken, member, deleteFile);

module.exports = router;
