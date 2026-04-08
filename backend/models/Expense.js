const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['accommodation', 'food', 'transport', 'sightseeing', 'activities', 'shopping', 'misc'],
      default: 'misc',
    },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
