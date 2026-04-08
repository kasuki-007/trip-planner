const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  googleAuth,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleAuth);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);

module.exports = router;
