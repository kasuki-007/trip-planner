const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { sendInviteEmail } = require('../utils/sendEmail');
const Activity = require('../models/Activity');
const Day = require('../models/Day');
const Comment = require('../models/Comment');
const Checklist = require('../models/Checklist');
const File = require('../models/File');
const Reservation = require('../models/Reservation');
const Expense = require('../models/Expense');

exports.getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ 'members.user': req.user._id })
    .populate('members.user', 'name email avatar')
    .sort({ createdAt: -1 });

  successResponse(res, 200, 'Trips fetched', trips, { count: trips.length });
});

exports.createTrip = asyncHandler(async (req, res) => {
  const { title, destination, startDate, endDate, coverImage, description, budget } = req.body;

  const trip = await Trip.create({
    title,
    destination,
    startDate,
    endDate,
    coverImage,
    description,
    budget: budget ?? 0,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  const populated = await trip.populate('members.user', 'name email avatar');
  successResponse(res, 201, 'Trip created', populated);
});

exports.getTrip = asyncHandler(async (req, res) => {
  await req.trip.populate('members.user', 'name email avatar');
  successResponse(res, 200, 'Trip fetched', req.trip);
});

exports.updateTrip = asyncHandler(async (req, res) => {
  const allowed = ['title', 'destination', 'startDate', 'endDate', 'coverImage', 'description', 'budget'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const trip = await Trip.findByIdAndUpdate(req.params.tripId, updates, { new: true, runValidators: true })
    .populate('members.user', 'name email avatar');

  successResponse(res, 200, 'Trip updated', trip);
});

exports.deleteTrip = asyncHandler(async (req, res) => {
  const tripId = req.params.tripId;

  await Promise.all([
    Activity.deleteMany({ trip: tripId }),
    Day.deleteMany({ trip: tripId }),
    Comment.deleteMany({ trip: tripId }),
    Checklist.deleteMany({ trip: tripId }),
    File.deleteMany({ trip: tripId }),
    Reservation.deleteMany({ trip: tripId }),
    Expense.deleteMany({ trip: tripId }),
  ]);
  await Trip.findByIdAndDelete(tripId);

  successResponse(res, 200, 'Trip and all related data deleted');
});

exports.inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const trip = req.trip;
  const resolvedRole = role || 'viewer';

  const invitee = await User.findOne({ email });

  if (invitee) {
    const alreadyMember = trip.members.some((m) => m.user.toString() === invitee._id.toString());
    if (alreadyMember) return errorResponse(res, 409, 'User is already a member of this trip');

    trip.members.push({ user: invitee._id, role: resolvedRole });
    trip.pendingInvites = trip.pendingInvites.filter((i) => i.email !== email.toLowerCase());
    await trip.save();
    await trip.populate('members.user', 'name email avatar');

    sendInviteEmail({
      to: invitee.email,
      inviteeName: invitee.name,
      inviterName: req.user.name,
      tripTitle: trip.title,
      role: resolvedRole,
      tripUrl: `${process.env.CLIENT_URL}/trips/${trip._id}`,
    }).catch((err) => console.error('Failed to send invite email:', err.message));

    return successResponse(res, 200, 'Member invited', trip);
  }

  const alreadyPending = trip.pendingInvites.some((i) => i.email === email.toLowerCase());
  if (alreadyPending) return errorResponse(res, 409, 'An invite has already been sent to this email');

  trip.pendingInvites.push({ email: email.toLowerCase(), role: resolvedRole });
  await trip.save();

  sendInviteEmail({
    to: email,
    inviteeName: email,
    inviterName: req.user.name,
    tripTitle: trip.title,
    role: resolvedRole,
    tripUrl: `${process.env.CLIENT_URL}/register`,
  }).catch((err) => console.error('Failed to send invite email:', err.message));

  successResponse(res, 200, `Invite sent to ${email}. They will be added when they sign up.`, trip);
});

exports.changeMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const trip = req.trip;
  const { userId } = req.params;

  const member = trip.members.find((m) => m.user.toString() === userId);
  if (!member) return errorResponse(res, 404, 'Member not found');

  if (member.role === 'owner') return errorResponse(res, 403, 'Cannot change the role of the trip owner');

  member.role = role;
  await trip.save();
  await trip.populate('members.user', 'name email avatar');

  successResponse(res, 200, 'Member role updated', trip);
});

exports.removeMember = asyncHandler(async (req, res) => {
  const trip = req.trip;
  const { userId } = req.params;

  const memberIndex = trip.members.findIndex((m) => m.user.toString() === userId);
  if (memberIndex === -1) return errorResponse(res, 404, 'Member not found');

  if (trip.members[memberIndex].role === 'owner') {
    return errorResponse(res, 403, 'Cannot remove the trip owner');
  }

  trip.members.splice(memberIndex, 1);
  await trip.save();

  successResponse(res, 200, 'Member removed');
});

exports.leaveTrip = asyncHandler(async (req, res) => {
  const trip = req.trip;
  const userId = req.user._id.toString();

  const memberIndex = trip.members.findIndex((m) => m.user.toString() === userId);
  if (memberIndex === -1) return errorResponse(res, 404, 'You are not a member');

  if (trip.members[memberIndex].role === 'owner') {
    return errorResponse(res, 403, 'Owner cannot leave. Transfer ownership or delete the trip.');
  }

  trip.members.splice(memberIndex, 1);
  await trip.save();
  successResponse(res, 200, 'You have left the trip');
});

exports.createTripValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
];

exports.inviteValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('role').optional().isIn(['editor', 'viewer']).withMessage('Role must be editor or viewer'),
];
