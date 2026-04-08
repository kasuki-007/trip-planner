const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  inviteMember,
  changeMemberRole,
  removeMember,
  leaveTrip,
  createTripValidation,
  inviteValidation,
} = require('../controllers/tripController');

router.get('/', verifyToken, getTrips);
router.post('/', verifyToken, createTripValidation, validate, createTrip);

router.get('/:tripId', verifyToken, checkRole(['owner', 'editor', 'viewer']), getTrip);
router.patch('/:tripId', verifyToken, checkRole(['owner']), updateTrip);
router.delete('/:tripId', verifyToken, checkRole(['owner']), deleteTrip);

router.post('/:tripId/invite', verifyToken, checkRole(['owner']), inviteValidation, validate, inviteMember);
router.patch('/:tripId/members/:userId', verifyToken, checkRole(['owner']), changeMemberRole);
router.delete('/:tripId/members/:userId', verifyToken, checkRole(['owner']), removeMember);
router.post('/:tripId/leave', verifyToken, checkRole(['owner', 'editor', 'viewer']), leaveTrip);

module.exports = router;
