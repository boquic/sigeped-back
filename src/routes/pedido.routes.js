import express from "express";
import { crearPedido, obtenerPedidos } from "../controllers/pedido.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

const router = express.Router();

// Solo usuarios autenticados (admin o trabajador)
router.post("/", authenticateJWT, requireRole(["admin", "trabajador"]), crearPedido);
router.get("/", authenticateJWT, requireRole(["admin", "trabajador"]), obtenerPedidos);

export default router;