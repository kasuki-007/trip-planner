const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Comment = require('../models/Comment');


exports.getComments = asyncHandler(async (req, res) => {
  const { refType, refId } = req.query;
  const filter = { trip: req.params.tripId };
  if (refType) filter.refType = refType;
  if (refId) filter.refId = refId;

  const comments = await Comment.find(filter)
    .populate('author', 'name email avatar')
    .populate('parentComment')
    .sort({ createdAt: 1 });

  successResponse(res, 200, 'Comments fetched', comments, { count: comments.length });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { text, refType, refId, parentComment } = req.body;

  const comment = await Comment.create({
    trip: req.params.tripId,
    author: req.user._id,
    text,
    refType,
    refId,
    parentComment: parentComment || null,
  });

  await comment.populate('author', 'name email avatar');
  successResponse(res, 201, 'Comment added', comment);
});

exports.editComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId, trip: req.params.tripId });
  if (!comment) return errorResponse(res, 404, 'Comment not found');

  if (comment.author.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Only the comment author can edit this comment');
  }

  comment.text = req.body.text;
  await comment.save();
  await comment.populate('author', 'name email avatar');

  successResponse(res, 200, 'Comment updated', comment);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId, trip: req.params.tripId });
  if (!comment) return errorResponse(res, 404, 'Comment not found');

  const isAuthor = comment.author.toString() === req.user._id.toString();
  const isOwner = req.userRole === 'owner';
  if (!isAuthor && !isOwner) {
    return errorResponse(res, 403, 'Only the author or trip owner can delete this comment');
  }

  await Comment.deleteMany({ parentComment: comment._id });
  await comment.deleteOne();

  successResponse(res, 200, 'Comment deleted');
});


exports.addCommentValidation = [
  body('text').notEmpty().withMessage('Comment text is required'),
  body('refType').isIn(['activity', 'day']).withMessage('refType must be activity or day'),
  body('refId').notEmpty().withMessage('refId is required'),
];

exports.editCommentValidation = [
  body('text').notEmpty().withMessage('Comment text is required'),
];
