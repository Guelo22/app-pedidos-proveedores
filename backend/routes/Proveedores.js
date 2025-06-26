const express = require('express');
const router = express.Router(); // ✔ Usa express.Router() correctamente
const pool = require('../db');

// Middleware de autenticación (asegúrate de tenerlo)
const authenticateToken = (req, res, next) => {
  // Tu lógica de autenticación aquí
  next();
};

// GET /api/proveedores - Corregido
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM proveedores');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// POST /api/proveedores - Corregido
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO proveedores (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, telefono]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

module.exports = router;