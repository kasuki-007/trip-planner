const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const validate = require('../middleware/validate');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  addExpenseValidation,
} = require('../controllers/expenseController');

const member = checkRole(['owner', 'editor', 'viewer']);
const editor = checkRole(['owner', 'editor']);

router.get('/summary', verifyToken, member, getExpenseSummary);
router.get('/', verifyToken, member, getExpenses);
router.post('/', verifyToken, editor, addExpenseValidation, validate, addExpense);
router.patch('/:expenseId', verifyToken, editor, updateExpense);
router.delete('/:expenseId', verifyToken, editor, deleteExpense);

module.exports = router;
