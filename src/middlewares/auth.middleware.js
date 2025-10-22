// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

/**
 * Verifica el token JWT y guarda los datos del usuario en req.user
 */
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado o inválido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = decoded; // guarda los datos del usuario en la request
    next();
  } catch (err) {
    console.error("❌ Error verificando token JWT:", err.message);
    res.status(403).json({ error: "Token inválido o expirado." });
  }
}