const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getItinerary,
  addDay,
  updateDay,
  deleteDay,
  addActivity,
  updateActivity,
  deleteActivity,
  reorderActivities,
  addDayValidation,
  addActivityValidation,
} = require('../controllers/itineraryController');

const member = checkRole(['owner', 'editor', 'viewer']);
const editor = checkRole(['owner', 'editor']);

router.get('/', verifyToken, member, getItinerary);

router.post('/days', verifyToken, editor, addDayValidation, validate, addDay);
router.patch('/days/:dayId', verifyToken, editor, updateDay);
router.delete('/days/:dayId', verifyToken, editor, deleteDay);

router.post('/days/:dayId/activities', verifyToken, editor, addActivityValidation, validate, addActivity);
router.patch('/days/:dayId/activities/:activityId', verifyToken, editor, updateActivity);
router.delete('/days/:dayId/activities/:activityId', verifyToken, editor, deleteActivity);
router.post('/days/:dayId/reorder', verifyToken, editor, reorderActivities);
router.patch('/activities/:activityId', verifyToken, editor, updateActivity);
router.delete('/activities/:activityId', verifyToken, editor, deleteActivity);

module.exports = router;
