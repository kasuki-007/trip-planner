const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Place this middleware after express-validator chains.
 * If validation fails, returns a 400 with the list of errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

module.exports = validate;
