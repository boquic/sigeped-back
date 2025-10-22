import { prisma } from "../db/prismaClient.js";

/**
 * POST /api/pedidos
 * Crea un nuevo pedido en la base de datos
 */
export async function crearPedido(req, res) {
  try {
    const { cliente, servicio, material, cantidad, archivoUrl } = req.body;

    if (!cliente || !servicio || !material || !cantidad)
      return res.status(400).json({ error: "Faltan datos obligatorios." });

    const pedido = await prisma.pedido.create({
      data: {
        cliente,
        servicio,
        material,
        cantidad: parseInt(cantidad, 10),
        archivoUrl,
      },
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error("❌ Error creando pedido:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * GET /api/pedidos
 * Retorna todos los pedidos (ordenados por fecha)
 */
export async function obtenerPedidos(req, res) {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { fecha: "desc" },
    });
    res.status(200).json(pedidos);
  } catch (error) {
    console.error("❌ Error listando pedidos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}