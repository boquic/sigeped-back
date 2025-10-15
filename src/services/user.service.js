// src/services/user.service.js
const bcrypt = require('bcrypt');
const { prisma } = require('../db/prismaClient');

const SALT_ROUNDS = 11;

async function findByIdentifier(identifier) {
  return prisma.uSUARIOS.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] }, include: { rol: true } });
}

async function findByEmail(email) {
  return prisma.uSUARIOS.findUnique({ where: { email }, include: { rol: true } });
}

async function findById(id) {
  return prisma.uSUARIOS.findUnique({ where: { id_usuario: id }, include: { rol: true } });
}

async function createUser({ username, email, password, telefono, id_rol }) {
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.uSUARIOS.create({
    data: { username, email, password_hash, telefono, id_rol },
    include: { rol: true },
  });
}

async function updateLastAccess(id) {
  return prisma.uSUARIOS.update({ where: { id_usuario: id }, data: { ultimo_acceso: new Date() } });
}

async function setPassword(id, newPassword) {
  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return prisma.uSUARIOS.update({ where: { id_usuario: id }, data: { password_hash } });
}

module.exports = { findByIdentifier, findByEmail, findById, createUser, updateLastAccess, setPassword };
