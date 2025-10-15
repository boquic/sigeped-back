// src/services/token.service.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../db/prismaClient');
const { config } = require('../config/env');

const SALT_ROUNDS = 11;

function signAccessToken(user) {
  const payload = {
    id_usuario: user.id_usuario,
    id_rol: user.id_rol,
    nombre_rol: user.rol?.nombre_rol,
    email: user.email,
  };
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl });
}

function generateRefreshTokenString() {
  return crypto.randomBytes(32).toString('hex'); // 256 bits
}

async function hash(value) {
  return bcrypt.hash(value, SALT_ROUNDS);
}

async function verifyHash(value, hashed) {
  return bcrypt.compare(value, hashed);
}

async function issueRefreshToken(userId, userAgent, ip) {
  const tokenPlain = generateRefreshTokenString();
  const tokenHash = await hash(tokenPlain);
  const expires = new Date(Date.now() + parseTtlMs(config.jwt.refreshTtl));
  await prisma.refreshToken.create({
    data: {
      userId,
      token_hash: tokenHash,
      expires_at: expires,
      user_agent: userAgent,
      ip,
    },
  });
  return tokenPlain;
}

function parseTtlMs(ttl) {
  // supports m,h,d suffix
  const m = ttl.match(/^(\d+)([smhd])$/);
  if (!m) return 15 * 60 * 1000;
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const mult = unit === 's' ? 1000 : unit === 'm' ? 60000 : unit === 'h' ? 3600000 : 86400000;
  return n * mult;
}

async function rotateRefreshToken(oldPlain, userAgent, ip) {
  const now = new Date();
  const tokens = await prisma.refreshToken.findMany({ where: { is_revoked: false, expires_at: { gt: now } } });
  // find matching by comparing hashes
  let matched = null;
  for (const t of tokens) {
    if (await verifyHash(oldPlain, t.token_hash)) {
      matched = t;
      break;
    }
  }
  if (!matched) {
    // revoke all tokens with same user if token reuse suspected
    return { error: 'InvalidToken' };
  }
  // revoke old and create new linked
  const newPlain = generateRefreshTokenString();
  const newHash = await hash(newPlain);
  const expires = new Date(Date.now() + parseTtlMs(config.jwt.refreshTtl));
  const newRec = await prisma.refreshToken.create({
    data: {
      userId: matched.userId,
      token_hash: newHash,
      expires_at: expires,
      user_agent: userAgent,
      ip,
      replaced_by_id: null,
    },
  });
  await prisma.refreshToken.update({ where: { id: matched.id }, data: { is_revoked: true, replaced_by_id: newRec.id } });
  return { userId: matched.userId, refreshToken: newPlain };
}

async function revokeTokenFamily(plain) {
  // when reuse detected, revoke all active tokens for that user even if the presented token was already revoked
  const tokens = await prisma.refreshToken.findMany();
  for (const t of tokens) {
    if (await verifyHash(plain, t.token_hash)) {
      await prisma.refreshToken.updateMany({ where: { userId: t.userId, is_revoked: false }, data: { is_revoked: true } });
      return;
    }
  }
}

async function revokeToken(plain) {
  const tokens = await prisma.refreshToken.findMany({ where: { is_revoked: false } });
  for (const t of tokens) {
    if (await verifyHash(plain, t.token_hash)) {
      await prisma.refreshToken.update({ where: { id: t.id }, data: { is_revoked: true } });
      return true;
    }
  }
  return false;
}

module.exports = {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeToken,
  revokeTokenFamily,
  parseTtlMs,
};
