const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ['image', 'pdf', 'document', 'other'], default: 'other' },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
