// src/seed/index.js
import bcrypt from 'bcrypt';
import { prisma } from '../db/prismaClient.js';
import { config } from '../config/env.js';

export async function seed() {
  // Ensure default role exists
  let defaultRole = await prisma.rOLES.findUnique({ where: { nombre_rol: config.defaultRoleName } });
  if (!defaultRole) {
    defaultRole = await prisma.rOLES.create({ data: { nombre_rol: config.defaultRoleName, descripcion: 'Default role', permisos: {} } });
  }

  // Ensure admin role exists
  let adminRole = await prisma.rOLES.findUnique({ where: { nombre_rol: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.rOLES.create({ data: { nombre_rol: 'admin', descripcion: 'Administrator', permisos: { manageUsers: true, admin: true } } });
  }

  // Seed admin user if env provided
  const { adminEmail, adminPassword, adminUsername } = config.seed;
  if (adminEmail && adminPassword && adminUsername) {
    let admin = await prisma.uSUARIOS.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      const password_hash = await bcrypt.hash(adminPassword, 11);
      admin = await prisma.uSUARIOS.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password_hash,
          id_rol: adminRole.id_rol,
          activo: true,
        },
      });
    }
  }
}
