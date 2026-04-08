const Trip = require('../models/Trip');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware factory — verifies the current user has one of the allowed roles
 * on the trip identified by req.params.tripId.
 *
 * Attaches req.trip and req.userRole for downstream controllers.
 *
 * Usage:  router.patch('/:tripId', verifyToken, checkRole(['owner']), updateTrip)
 *
 * @param {string[]} allowedRoles   e.g. ['owner'] | ['owner', 'editor']
 */
const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return errorResponse(res, 404, 'Trip not found');

    const member = trip.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) return errorResponse(res, 403, 'You are not a member of this trip');

    if (!allowedRoles.includes(member.role)) {
      return errorResponse(
        res,
        403,
        `Requires role: ${allowedRoles.join(' or ')} — you are: ${member.role}`
      );
    }

    req.trip = trip;
    req.userRole = member.role;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkRole;
