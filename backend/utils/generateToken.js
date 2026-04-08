const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for the given user id.
 * @param {string} userId
 * @returns {string} signed token
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

module.exports = generateToken;
