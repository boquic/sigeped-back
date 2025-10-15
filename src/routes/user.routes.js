// src/routes/user.routes.js
const express = require('express');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/ping', authenticateJWT, (req, res) => {
  res.json({ pong: true });
});

module.exports = router;
