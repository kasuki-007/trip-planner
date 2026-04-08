const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  addReservationValidation,
} = require('../controllers/reservationController');

const member = checkRole(['owner', 'editor', 'viewer']);
const editor = checkRole(['owner', 'editor']);

router.get('/', verifyToken, member, getReservations);
router.post('/', verifyToken, editor, addReservationValidation, validate, addReservation);
router.patch('/:reservationId', verifyToken, editor, updateReservation);
router.delete('/:reservationId', verifyToken, editor, deleteReservation);

module.exports = router;
