// src/config/logger.js
import pino from 'pino';

const redact = {
  paths: ['req.headers.authorization', 'password', 'token', 'token_hash'],
  remove: true,
};

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  redact,
});

