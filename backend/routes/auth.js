// backend/routes/auth.js
const express = require('express');
const router = express.Router(); // Esta línea es crucial
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Asegúrate de que esta ruta sea correcta

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación simple para desarrollo
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.json({
        token,
        user: { email, role: 'admin' }
      });
    }

    res.status(401).json({ error: 'Credenciales inválidas' });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router; // Exportamos el router