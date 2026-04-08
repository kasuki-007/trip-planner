const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');
const Trip = require('../models/Trip');
const generateToken = require('../utils/generateToken');
const getFirebaseAdmin = require('../config/firebase');

const sendTokenResponse = (res, statusCode, message, user) => {
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return successResponse(res, statusCode, message, { user: userObj, token });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return errorResponse(res, 409, 'Email already registered');

  const user = await User.create({ name, email, password });

  const pendingTrips = await Trip.find({ 'pendingInvites.email': email.toLowerCase() });
  for (const trip of pendingTrips) {
    const invite = trip.pendingInvites.find((i) => i.email === email.toLowerCase());
    if (invite) {
      trip.members.push({ user: user._id, role: invite.role });
      trip.pendingInvites = trip.pendingInvites.filter((i) => i.email !== email.toLowerCase());
      await trip.save();
    }
  }

  sendTokenResponse(res, 201, 'Account created', user);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  sendTokenResponse(res, 200, 'Login successful', user);
});

exports.logout = asyncHandler(async (_req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  successResponse(res, 200, 'Logged out successfully');
});

exports.getMe = asyncHandler(async (req, res) => {
  successResponse(res, 200, 'Current user', req.user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  ).select('-password');

  successResponse(res, 200, 'Profile updated', updated);
});

exports.googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return errorResponse(res, 400, 'Firebase ID token required');

  let decoded;
  try {
    const admin = getFirebaseAdmin();
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch {
    return errorResponse(res, 401, 'Invalid or expired Google token');
  }

  const { uid, email, name, picture } = decoded;
  if (!email) return errorResponse(res, 400, 'Google account has no email');

  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = uid;
      await user.save();
    }
  } else {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId: uid,
      avatar: picture || '',
    });

    const pendingTrips = await Trip.find({ 'pendingInvites.email': email.toLowerCase() });
    for (const trip of pendingTrips) {
      const invite = trip.pendingInvites.find((i) => i.email === email.toLowerCase());
      if (invite) {
        trip.members.push({ user: user._id, role: invite.role });
        trip.pendingInvites = trip.pendingInvites.filter((i) => i.email !== email.toLowerCase());
        await trip.save();
      }
    }
  }

  sendTokenResponse(res, 200, 'Google login successful', user);
});

exports.registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];
