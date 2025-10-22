// src/controllers/pedidoController.js
import Pedido from '../models/Pedido.js';

export const crearPedido = async (req, res) => {
  try {
    const { cliente, servicio, material, cantidad } = req.body;
    const nuevoPedido = new Pedido({ cliente, servicio, material, cantidad });
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ fecha: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};