const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const checklistSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    type: { type: String, enum: ['packing', 'todo'], required: true },
    items: [checklistItemSchema],
  },
  { timestamps: true }
);

checklistSchema.index({ trip: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Checklist', checklistSchema);
