const express = require('express');
const router = express.Router();
const { crearPedido, obtenerPedidos } = require('../controllers/pedidoController'); // ← ¡IMPORTA obtenerPedidos!

router.post('/', crearPedido);
router.get('/', obtenerPedidos); // ← ¡AHORA SÍ ESTÁ DEFINIDA!

module.exports = router;