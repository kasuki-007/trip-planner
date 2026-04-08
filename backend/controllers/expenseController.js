const { body } = require('express-validator');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Expense = require('../models/Expense');


exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ trip: req.params.tripId })
    .populate('paidBy', 'name email avatar')
    .sort({ date: -1 });

  successResponse(res, 200, 'Expenses fetched', expenses, { count: expenses.length });
});

exports.addExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, paidBy, date, notes } = req.body;

  const expense = await Expense.create({
    trip: req.params.tripId,
    title,
    amount,
    category: category || 'misc',
    paidBy: paidBy || req.user._id,
    date: date || Date.now(),
    notes,
  });

  await expense.populate('paidBy', 'name email avatar');
  successResponse(res, 201, 'Expense added', expense);
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const allowed = ['title', 'amount', 'category', 'paidBy', 'date', 'notes'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.expenseId, trip: req.params.tripId },
    updates,
    { new: true, runValidators: true }
  ).populate('paidBy', 'name email avatar');

  if (!expense) return errorResponse(res, 404, 'Expense not found');
  successResponse(res, 200, 'Expense updated', expense);
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.expenseId,
    trip: req.params.tripId,
  });
  if (!expense) return errorResponse(res, 404, 'Expense not found');
  successResponse(res, 200, 'Expense deleted');
});

exports.getExpenseSummary = asyncHandler(async (req, res) => {
  const tripId = new mongoose.Types.ObjectId(req.params.tripId);

  const [totalResult, byCategory, byMember] = await Promise.all([
    Expense.aggregate([
      { $match: { trip: tripId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { trip: tripId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: { trip: tripId } },
      { $group: { _id: '$paidBy', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }],
        },
      },
      { $unwind: { path: '$user', preserveNullAndArrays: true } },
      { $sort: { total: -1 } },
    ]),
  ]);

  const summary = {
    total: totalResult[0]?.total ?? 0,
    byCategory,
    byMember,
  };

  successResponse(res, 200, 'Expense summary', summary);
});


exports.addExpenseValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .isIn(['accommodation', 'food', 'transport', 'sightseeing', 'activities', 'shopping', 'misc'])
    .withMessage('Invalid category'),
];
