// src/config/logger.js
const pino = require('pino');

const redact = {
  paths: ['req.headers.authorization', 'password', 'token', 'token_hash'],
  remove: true,
};

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  redact,
});

module.exports = { logger };
