const mongoose = require('mongoose');

const daySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    date: { type: Date, required: true },
    order: { type: Number, default: 0 },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

daySchema.index({ trip: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Day', daySchema);
