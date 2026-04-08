/**
 * Send a uniform success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data  - single object for POST/GET-one, or omit for list responses
 * @param {object} extra - optional extra top-level fields (e.g. count)
 */
const successResponse = (res, statusCode, message, data, extra = {}) => {
  const payload = { success: true, message, ...extra };
  if (data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
};

/**
 * Send a uniform error response.
 */
const errorResponse = (res, statusCode, message, errors = []) =>
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
  });

module.exports = { successResponse, errorResponse };
