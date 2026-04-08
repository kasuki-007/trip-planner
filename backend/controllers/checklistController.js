const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Checklist = require('../models/Checklist');

const getOrCreate = async (tripId, type) => {
  let checklist = await Checklist.findOne({ trip: tripId, type });
  if (!checklist) {
    checklist = await Checklist.create({ trip: tripId, type, items: [] });
  }
  return checklist;
};

exports.getChecklists = asyncHandler(async (req, res) => {
  const checklists = await Checklist.find({ trip: req.params.tripId });
  successResponse(res, 200, 'Checklists fetched', checklists, { count: checklists.length });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { text } = req.body;

  const checklist = await getOrCreate(req.params.tripId, type);
  checklist.items.push({ text, completed: false, addedBy: req.user._id });
  await checklist.save();

  successResponse(res, 201, 'Item added', checklist);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { type, itemId } = req.params;
  const { text, completed } = req.body;

  const checklist = await Checklist.findOne({ trip: req.params.tripId, type });
  if (!checklist) return errorResponse(res, 404, 'Checklist not found');

  const item = checklist.items.id(itemId);
  if (!item) return errorResponse(res, 404, 'Item not found');

  if (text !== undefined) item.text = text;
  if (completed !== undefined) item.completed = completed;
  await checklist.save();

  successResponse(res, 200, 'Item updated', checklist);
});

exports.deleteItem = asyncHandler(async (req, res) => {
  const { type, itemId } = req.params;

  const checklist = await Checklist.findOne({ trip: req.params.tripId, type });
  if (!checklist) return errorResponse(res, 404, 'Checklist not found');

  const item = checklist.items.id(itemId);
  if (!item) return errorResponse(res, 404, 'Item not found');

  item.deleteOne();
  await checklist.save();

  successResponse(res, 200, 'Item deleted', checklist);
});


exports.addItemValidation = [
  body('text').notEmpty().withMessage('Item text is required'),
];
