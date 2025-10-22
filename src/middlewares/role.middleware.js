// src/middlewares/role.middleware.js
import { prisma } from '../db/prismaClient.js';

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { code: 'Unauthorized', message: 'Login required' } });
    if (!roles.includes(req.user.nombre_rol)) {
      return res.status(403).json({ error: { code: 'Forbidden', message: 'Insufficient role' } });
    }
    next();
  };
}

export function requirePermisos(...acciones) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { code: 'Unauthorized', message: 'Login required' } });
    const rol = await prisma.rOLES.findUnique({ where: { id_rol: req.user.id_rol } });
    const permisos = (rol?.permisos || {});
    const allowed = acciones.every((a) => permisos[a]);
    if (!allowed) return res.status(403).json({ error: { code: 'Forbidden', message: 'Missing permission' } });
    next();
  };
}
