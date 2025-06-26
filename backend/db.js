// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pedidos_proveedores',
  password: process.env.DB_PASSWORD || 'tu_contraseña',
  port: process.env.DB_PORT || 5432,
});

// Verificación de conexión
pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ Error al conectar a PostgreSQL:', err);
  else console.log('✅ PostgreSQL conectado');
});

module.exports = pool;