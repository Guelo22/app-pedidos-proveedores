const express = require('express');
const router = express.Router(); // Usar express.Router() directamente
const pool = require('../db');
const authenticateToken = (req, res, next) => {
  // Tu lógica de autenticación aquí
  next();
};

const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET /api/productos - Lista con filtros
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, minPrecio, maxPrecio, proveedorId, minStock } = req.query;
    let query = 'SELECT * FROM productos WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nombre ILIKE $1 OR descripcion ILIKE $1)';
      params.push(`%${search}%`);
    }

    if (minPrecio) {
      query += ` AND precio >= $${params.length + 1}`;
      params.push(parseFloat(minPrecio));
    }

    if (maxPrecio) {
      query += ` AND precio <= $${params.length + 1}`;
      params.push(parseFloat(maxPrecio));
    }

    if (proveedorId) {
      query += ` AND proveedor_id = $${params.length + 1}`;
      params.push(proveedorId);
    }

    if (minStock) {
      query += ` AND stock >= $${params.length + 1}`;
      params.push(parseInt(minStock));
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// POST /api/productos - Crear producto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, proveedor_id } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio, stock, proveedor_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;