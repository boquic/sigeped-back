// src/middlewares/roles.middleware.js

/**
 * Middleware para exigir uno o varios roles.
 * Requiere que authenticateJWT ya haya puesto req.user.
 */
export function requireRole(rolesPermitidos = []) {
  return (req, res, next) => {
    try {
      const usuario = req.user;
      if (!usuario) {
        return res.status(401).json({ error: "No autenticado." });
      }

      // si el token tiene un campo 'rol' o 'role'
      const rolUsuario = usuario.rol || usuario.role || usuario.nombre_rol;

      if (!rolUsuario) {
        return res.status(403).json({ error: "Rol no especificado en el token." });
      }

      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          error: `Acceso denegado. Se requieren roles: ${rolesPermitidos.join(", ")}`,
        });
      }

      next();
    } catch (err) {
      console.error("❌ Error en requireRole:", err.message);
      res.status(500).json({ error: "Error interno en verificación de roles." });
    }
  };
}