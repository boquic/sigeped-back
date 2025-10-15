// src/middlewares/error.middleware.js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'InternalError';
  const message = err.message || 'Internal Server Error';
  const details = err.details;

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });
}

module.exports = { errorHandler };
