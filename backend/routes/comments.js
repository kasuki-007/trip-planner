const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getComments,
  addComment,
  editComment,
  deleteComment,
  addCommentValidation,
  editCommentValidation,
} = require('../controllers/commentController');

const member = checkRole(['owner', 'editor', 'viewer']);

router.get('/', verifyToken, member, getComments);
router.post('/', verifyToken, member, addCommentValidation, validate, addComment);
router.patch('/:commentId', verifyToken, member, editCommentValidation, validate, editComment);
router.delete('/:commentId', verifyToken, member, deleteComment);

module.exports = router;
