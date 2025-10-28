// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { prisma } from "../db/prismaClient.js";

/**
 * Verifica el token JWT y guarda los datos del usuario en req.user
 */
export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado o inválido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    // Cargar usuario actual desde DB para validar estado y rol
    const user = await prisma.uSUARIOS.findUnique({
      where: { id_usuario: decoded.id_usuario },
      include: { rol: true },
    });
    if (!user || !user.activo) return res.status(401).json({ error: "Invalid token or inactive user" });
    req.user = {
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
      nombre_rol: user.rol?.nombre_rol,
      email: user.email,
    };
    next();
  } catch (err) {
    console.error("❌ Error verificando token JWT:", err.message);
    res.status(403).json({ error: "Token inválido o expirado." });
  }
}

export function adminOnly(req, res, next) {
  const rol = req.user?.nombre_rol || req.user?.rol || req.user?.role;
  if (rol !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}