const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Day = require('../models/Day');
const Activity = require('../models/Activity');

exports.getItinerary = asyncHandler(async (req, res) => {
  const days = await Day.find({ trip: req.params.tripId })
    .populate({
      path: 'activities',
      options: { sort: { order: 1 } },
    })
    .sort({ date: 1 });

  successResponse(res, 200, 'Itinerary fetched', days, { count: days.length });
});

exports.addDay = asyncHandler(async (req, res) => {
  const { date, notes, order } = req.body;

  const existing = await Day.findOne({ trip: req.params.tripId, date });
  if (existing) return errorResponse(res, 409, 'A day with that date already exists for this trip');

  const dayCount = await Day.countDocuments({ trip: req.params.tripId });
  const day = await Day.create({
    trip: req.params.tripId,
    date,
    order: order ?? dayCount + 1,
    notes,
  });

  successResponse(res, 201, 'Day added', day);
});

exports.updateDay = asyncHandler(async (req, res) => {
  const { notes, order } = req.body;
  const updates = {};
  if (notes !== undefined) updates.notes = notes;
  if (order !== undefined) updates.order = order;

  const day = await Day.findOneAndUpdate(
    { _id: req.params.dayId, trip: req.params.tripId },
    updates,
    { new: true, runValidators: true }
  );
  if (!day) return errorResponse(res, 404, 'Day not found');

  successResponse(res, 200, 'Day updated', day);
});

exports.deleteDay = asyncHandler(async (req, res) => {
  const day = await Day.findOneAndDelete({ _id: req.params.dayId, trip: req.params.tripId });
  if (!day) return errorResponse(res, 404, 'Day not found');

  await Activity.deleteMany({ day: day._id });

  successResponse(res, 200, 'Day and its activities deleted');
});

exports.addActivity = asyncHandler(async (req, res) => {
  const { title, type, startTime, endTime, location, notes, order } = req.body;

  const day = await Day.findOne({ _id: req.params.dayId, trip: req.params.tripId });
  if (!day) return errorResponse(res, 404, 'Day not found');

  const activityCount = await Activity.countDocuments({ day: day._id });

  const activity = await Activity.create({
    day: day._id,
    trip: req.params.tripId,
    title,
    type: type || 'activity',
    startTime,
    endTime,
    location,
    notes,
    order: order ?? activityCount + 1,
    createdBy: req.user._id,
  });

  day.activities.push(activity._id);
  await day.save();

  successResponse(res, 201, 'Activity added', activity);
});

exports.updateActivity = asyncHandler(async (req, res) => {
  const allowed = ['title', 'type', 'startTime', 'endTime', 'location', 'notes', 'order'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const filter = { _id: req.params.activityId, trip: req.params.tripId };
  if (req.params.dayId) filter.day = req.params.dayId;

  const activity = await Activity.findOneAndUpdate(
    filter,
    updates,
    { new: true, runValidators: true }
  );
  if (!activity) return errorResponse(res, 404, 'Activity not found');

  successResponse(res, 200, 'Activity updated', activity);
});

exports.deleteActivity = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.activityId, trip: req.params.tripId };
  if (req.params.dayId) filter.day = req.params.dayId;

  const activity = await Activity.findOneAndDelete(filter);
  if (!activity) return errorResponse(res, 404, 'Activity not found');

  await Day.findByIdAndUpdate(activity.day, {
    $pull: { activities: activity._id },
  });

  successResponse(res, 200, 'Activity deleted');
});

exports.reorderActivities = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return errorResponse(res, 400, 'orderedIds must be an array of activity IDs');
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      Activity.findByIdAndUpdate(id, { order: index + 1 })
    )
  );

  successResponse(res, 200, 'Activities reordered');
});

exports.addDayValidation = [
  body('date').isISO8601().withMessage('Valid date required'),
];

exports.addActivityValidation = [
  body('title').notEmpty().withMessage('Activity title is required'),
  body('type')
    .optional()
    .isIn(['food', 'transport', 'stay', 'sightseeing', 'activity', 'shopping', 'other'])
    .withMessage('Invalid activity type'),
];
