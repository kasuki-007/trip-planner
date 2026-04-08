/**
 * Wraps an async route handler so thrown errors are forwarded to next().
 * Eliminates repetitive try/catch boilerplate in every controller.
 *
 * @param {Function} fn  async (req, res, next) => {}
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
