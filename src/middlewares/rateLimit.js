// src/middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');
const { config } = require('../config/env');
const { logger } = require('../config/logger');

function build429Handler(label) {
  return function handler(req, res, _next, _options) {
    try {
      const rl = req.rateLimit || {};
      let retryAfterSeconds;
      if (rl.resetTime instanceof Date) {
        retryAfterSeconds = Math.max(1, Math.ceil((rl.resetTime.getTime() - Date.now()) / 1000));
      } else if (typeof _options?.windowMs === 'number') {
        retryAfterSeconds = Math.max(1, Math.ceil(_options.windowMs / 1000));
      } else {
        retryAfterSeconds = 60;
      }
      res.setHeader('Retry-After', String(retryAfterSeconds));

      const email = (req.body && typeof req.body.email === 'string') ? req.body.email : undefined;
      logger.warn({
        event: 'rate_limit_exceeded',
        label,
        method: req.method,
        path: req.originalUrl || req.url,
        ip: req.ip,
        email,
        limit: rl.limit,
        current: rl.current,
        remaining: rl.remaining,
        resetTime: rl.resetTime,
        windowMs: _options?.windowMs,
      }, 'Rate limit exceeded');

      res.status(429).json({
        message: 'Too many requests. Please wait and try again.',
        retryAfterSeconds,
      });
    } catch (e) {
      // Fallback in case something goes wrong while building the response
      res.setHeader('Retry-After', '60');
      res.status(429).json({ message: 'Too many requests. Please wait and try again.', retryAfterSeconds: 60 });
    }
  };
}

const isDev = config.nodeEnv === 'development';

// Login limiter
const loginLimiter = isDev
  ? rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 50,
      standardHeaders: true,
      legacyHeaders: false,
      handler: build429Handler('login-dev'),
    })
  : rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      // Use IP + email for login attempts
      keyGenerator: (req, _res) => {
        const ip = req.ip || 'unknown';
        const emailRaw = req.body && typeof req.body.email === 'string' ? req.body.email : '';
        const email = emailRaw.trim().toLowerCase();
        return `${ip}:${email}`;
      },
      handler: build429Handler('login'),
    });

// Forgot password limiter (kept per-IP; could be extended similarly)
const forgotPasswordLimiter = isDev
  ? rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      handler: build429Handler('forgot-password-dev'),
    })
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      handler: build429Handler('forgot-password'),
    });

module.exports = { loginLimiter, forgotPasswordLimiter };
