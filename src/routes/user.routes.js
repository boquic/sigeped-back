// src/routes/user.routes.js
import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/ping', authenticateJWT, (req, res) => {
  res.json({ pong: true });
});

export default router;
