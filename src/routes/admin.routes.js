// src/routes/admin.routes.js
import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../db/prismaClient.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { config } from '../config/env.js';
import { sendNewAccountEmail, sendPasswordResetEmail } from '../services/email.service.js';

const router = express.Router();

// Email sending is centralized in services/email.service.js

router.get('/ping', authenticateJWT, requireRole('admin'), (req, res) => {
  res.json({ pong: true, at: new Date().toISOString() });
});

// GET /admin/users - list active users
router.get('/users', authenticateJWT, requireRole('admin'), async (req, res) => {
  const users = await prisma.uSUARIOS.findMany({
    where: { activo: true },
    select: {
      id_usuario: true,
      username: true,
      email: true,
      telefono: true,
      created_at: true,
      rol: { select: { nombre_rol: true } },
    },
  });
  res.json(users);
});

// POST /admin/users - create a user with a temporary password and email it
router.post('/users', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const { username, email, telefono } = req.body;
    if (!username || !email) return res.status(400).json({ error: 'username y email son requeridos' });

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const password_hash = await bcrypt.hash(tempPassword, 11);

    // Prefer role "trabajador" if it exists, otherwise fallback to DEFAULT_ROLE_NAME
    let rol = await prisma.rOLES.findUnique({ where: { nombre_rol: 'trabajador' } });
    if (!rol) rol = await prisma.rOLES.findUnique({ where: { nombre_rol: config.defaultRoleName } });
    if (!rol) return res.status(400).json({ error: 'Rol por defecto no encontrado' });

    const user = await prisma.uSUARIOS.create({
      data: { username, email, telefono, password_hash, id_rol: rol.id_rol, activo: true },
      include: { rol: true },
    });

    await sendNewAccountEmail(email, username, tempPassword);

    res.status(201).json({ message: 'Usuario creado', user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /admin/users/:id/reset - reset password and email it
router.put('/users/:id/reset', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await prisma.uSUARIOS.findUnique({ where: { id_usuario: id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const password_hash = await bcrypt.hash(tempPassword, 11);
    await prisma.uSUARIOS.update({ where: { id_usuario: id }, data: { password_hash, updated_at: new Date() } });

    await sendPasswordResetEmail(user.email, user.username, tempPassword);

    res.json({ message: 'Contraseña restablecida' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
