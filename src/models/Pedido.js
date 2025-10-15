const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  servicio: { type: String, required: true },
  material: { type: String, required: true },
  cantidad: { type: Number, required: true },
  archivoUrl: { type: String },
  estado: {
    type: String,
    enum: ['pendiente', 'revision', 'produccion', 'completado', 'rechazado'],
    default: 'pendiente'
  },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);