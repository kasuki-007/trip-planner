const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coverImage: { type: String, default: '' },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    budget: { type: Number, default: 0 },
    pendingInvites: [
      {
        email: { type: String, lowercase: true, trim: true },
        role: { type: String, enum: ['editor', 'viewer'], default: 'viewer' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
