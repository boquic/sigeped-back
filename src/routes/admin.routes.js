// src/routes/admin.routes.js
const express = require('express');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/ping', authenticateJWT, requireRole('admin'), (req, res) => {
  res.json({ pong: true, at: new Date().toISOString() });
});

module.exports = router;
