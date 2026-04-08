const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    refType: { type: String, enum: ['activity', 'day'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
