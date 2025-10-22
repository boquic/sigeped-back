// src/routes/auth.routes.js
import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { registerHandler, loginLimiter, loginHandler, refreshHandler, logoutHandler, meHandler, forgotPasswordLimiter, forgotPasswordHandler, resetPasswordHandler } from '../controllers/auth.controller.js';
import { validate, registerSchema, loginSchema, refreshSchema} from '../schemas/auth.schemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', loginLimiter, validate(loginSchema), loginHandler);
router.post('/refresh', validate(refreshSchema), refreshHandler);
router.post('/logout', validate(refreshSchema), logoutHandler);
router.get('/me', authenticateJWT, meHandler);

export default router;
