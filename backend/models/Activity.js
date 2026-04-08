const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['food', 'transport', 'stay', 'sightseeing', 'activity', 'shopping', 'other'],
      default: 'other',
    },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    location: { type: String, default: '' },
    notes: { type: String, default: '' },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
