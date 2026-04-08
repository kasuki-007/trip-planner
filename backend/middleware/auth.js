const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * Verify JWT from Authorization header or cookie.
 * Attaches the full user document (without password) to req.user.
 */
const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authenticated — no token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    return errorResponse(res, 401, 'User no longer exists');
  }

  next();
});

module.exports = verifyToken;
