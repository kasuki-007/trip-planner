const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    type: {
      type: String,
      enum: ['hotel', 'flight', 'car', 'restaurant', 'activity', 'other'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    bookingRef: { type: String, default: '' },
    checkIn: { type: Date },
    checkOut: { type: Date },
    notes: { type: String, default: '' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
