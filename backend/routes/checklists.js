const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getChecklists,
  addItem,
  updateItem,
  deleteItem,
  addItemValidation,
} = require('../controllers/checklistController');

const member = checkRole(['owner', 'editor', 'viewer']);
const editor = checkRole(['owner', 'editor']);

router.get('/', verifyToken, member, getChecklists);
router.post('/:type/items', verifyToken, editor, addItemValidation, validate, addItem);
router.patch('/:type/items/:itemId', verifyToken, editor, updateItem);
router.delete('/:type/items/:itemId', verifyToken, editor, deleteItem);

module.exports = router;
