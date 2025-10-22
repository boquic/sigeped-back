// src/routes/admin.routes.js
import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/ping', authenticateJWT, requireRole('admin'), (req, res) => {
  res.json({ pong: true, at: new Date().toISOString() });
});

export default router;
