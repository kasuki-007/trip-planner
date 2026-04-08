const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Reservation = require('../models/Reservation');

exports.getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ trip: req.params.tripId })
    .populate('addedBy', 'name email avatar')
    .sort({ checkIn: 1 });

  successResponse(res, 200, 'Reservations fetched', reservations, { count: reservations.length });
});

exports.addReservation = asyncHandler(async (req, res) => {
  const { type, title, bookingRef, checkIn, checkOut, notes } = req.body;

  const reservation = await Reservation.create({
    trip: req.params.tripId,
    addedBy: req.user._id,
    type,
    title,
    bookingRef,
    checkIn,
    checkOut,
    notes,
  });

  await reservation.populate('addedBy', 'name email avatar');
  successResponse(res, 201, 'Reservation added', reservation);
});

exports.updateReservation = asyncHandler(async (req, res) => {
  const allowed = ['type', 'title', 'bookingRef', 'checkIn', 'checkOut', 'notes'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const reservation = await Reservation.findOneAndUpdate(
    { _id: req.params.reservationId, trip: req.params.tripId },
    updates,
    { new: true, runValidators: true }
  ).populate('addedBy', 'name email avatar');

  if (!reservation) return errorResponse(res, 404, 'Reservation not found');
  successResponse(res, 200, 'Reservation updated', reservation);
});

exports.deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findOneAndDelete({
    _id: req.params.reservationId,
    trip: req.params.tripId,
  });
  if (!reservation) return errorResponse(res, 404, 'Reservation not found');
  successResponse(res, 200, 'Reservation deleted');
});

exports.addReservationValidation = [
  body('type')
    .isIn(['hotel', 'flight', 'car', 'restaurant', 'activity', 'other'])
    .withMessage('Invalid reservation type'),
  body('title').notEmpty().withMessage('Title is required'),
];
