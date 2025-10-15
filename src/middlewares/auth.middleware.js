// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../db/prismaClient');
const { config } = require('../config/env');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: { code: 'Unauthorized', message: 'Missing token' } });

  jwt.verify(token, config.jwt.accessSecret, (err, payload) => {
    if (err) return res.status(401).json({ error: { code: 'Unauthorized', message: 'Invalid token' } });
    req.user = payload; // { id_usuario, id_rol, nombre_rol, email }
    next();
  });
}

module.exports = { authenticateJWT };
