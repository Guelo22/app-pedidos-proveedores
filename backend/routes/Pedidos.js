const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = (req, res, next) => {
  // Tu lógica de autenticación aquí
  next();
};

// Ruta para crear pedido (punto 6 completo)
router.post('/', authenticateToken, async (req, res) => {
  const { proveedor_id, productos } = req.body;
  
  try {
    await pool.query('BEGIN');
    
    const pedidoRes = await pool.query(
      'INSERT INTO pedidos (proveedor_id, usuario_id) VALUES ($1, $2) RETURNING id',
      [proveedor_id, req.user.id] // Asume que tienes usuario autenticado
    );
    
    const pedidoId = pedidoRes.rows[0].id;
    
    for (const producto of productos) {
      await pool.query(
        'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [
          pedidoId, 
          producto.id, 
          producto.cantidad || 1,
          producto.precio
        ]
      );
    }
    
    await pool.query('COMMIT');
    res.status(201).json({ 
      success: true,
      pedidoId 
    });
    
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error en pedido:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error al procesar pedido' 
    });
  }
});

module.exports = router;