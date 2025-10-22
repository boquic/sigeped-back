// src/services/auth.service.js
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../db/prismaClient.js';
import { config } from '../config/env.js';
import { signAccessToken, issueRefreshToken, rotateRefreshToken, revokeToken, revokeTokenFamily } from './token.service.js';
import { findByIdentifier, findByEmail, createUser, updateLastAccess, setPassword } from './user.service.js';
import { sendPasswordReset } from './email.service.js';

export async function ensureDefaultRole() {
  let role = await prisma.rOLES.findUnique({ where: { nombre_rol: config.defaultRoleName } });
  if (!role) {
    role = await prisma.rOLES.create({ data: { nombre_rol: config.defaultRoleName, descripcion: 'Default role', permisos: {} } });
  }
  return role;
}

export async function register({ username, email, password, telefono }) {
  const role = await ensureDefaultRole();
  const existing = await prisma.uSUARIOS.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    const err = new Error('User already exists');
    err.status = 409; err.code = 'Conflict';
    throw err;
  }
  const user = await createUser({ username, email, password, telefono, id_rol: role.id_rol });
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id_usuario, null, null);
  return { user: publicUser(user), accessToken, refreshToken };
}

export async function login({ identifier, password }, ua, ip) {
  const user = await findByIdentifier(identifier);
  if (!user) return invalidCreds();
  if (!user.activo) return makeError(403, 'UserInactive', 'User is inactive');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return invalidCreds();
  await updateLastAccess(user.id_usuario);
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id_usuario, ua, ip);
  return { user: publicUser(user), accessToken, refreshToken };
}

export async function refresh(oldToken, ua, ip) {
  const rotated = await rotateRefreshToken(oldToken, ua, ip);
  if (rotated?.error) {
    await revokeTokenFamily(oldToken);
    return makeError(401, 'Unauthorized', 'Invalid refresh token');
  }
  const user = await prisma.uSUARIOS.findUnique({ where: { id_usuario: rotated.userId }, include: { rol: true } });
  const accessToken = signAccessToken(user);
  return { accessToken, refreshToken: rotated.refreshToken };
}

export async function logout(token) {
  await revokeToken(token);
}

export async function me(userId) {
  const user = await prisma.uSUARIOS.findUnique({ where: { id_usuario: userId }, include: { rol: true } });
  return { user: publicUser(user) };
}

export async function forgotPassword(email) {
  const user = await findByEmail(email);
  if (!user) return; // avoid email enumeration
  const tokenPlain = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(tokenPlain, 11);
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.create({ data: { userId: user.id_usuario, token_hash: tokenHash, expires_at: expires } });
  await sendPasswordReset(user.email, tokenPlain);
}

export async function resetPassword(tokenPlain, newPassword) {
  const now = new Date();
  const tokens = await prisma.passwordResetToken.findMany({ where: { used_at: null, expires_at: { gt: now } } });
  for (const t of tokens) {
    const match = await bcrypt.compare(tokenPlain, t.token_hash);
    if (match) {
      await setPassword(t.userId, newPassword);
      await prisma.passwordResetToken.update({ where: { id: t.id }, data: { used_at: new Date() } });
      await prisma.refreshToken.updateMany({ where: { userId: t.userId, is_revoked: false }, data: { is_revoked: true } });
      return;
    }
  }
  return makeError(400, 'InvalidToken', 'Invalid or expired token');
}

function publicUser(u) {
  if (!u) return null;
  return {
    id_usuario: u.id_usuario,
    username: u.username,
    email: u.email,
    telefono: u.telefono,
    id_rol: u.id_rol,
    nombre_rol: u.rol?.nombre_rol,
    activo: u.activo,
    ultimo_acceso: u.ultimo_acceso,
  };
}

function makeError(status, code, message, details) {
  const err = new Error(message);
  err.status = status; err.code = code; err.details = details; return err;
}

function invalidCreds() { return makeError(401, 'InvalidCredentials', 'Invalid credentials'); }

