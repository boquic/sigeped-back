// src/routes/auth.routes.js
const express = require('express');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { registerHandler, loginLimiter, loginHandler, refreshHandler, logoutHandler, meHandler, forgotPasswordLimiter, forgotPasswordHandler, resetPasswordHandler } = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', loginLimiter, validate(loginSchema), loginHandler);
router.post('/refresh', validate(refreshSchema), refreshHandler);
router.post('/logout', validate(refreshSchema), logoutHandler);
router.get('/me', authenticateJWT, meHandler);
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotSchema), forgotPasswordHandler);
router.post('/reset-password', validate(resetSchema), resetPasswordHandler);

module.exports = router;
