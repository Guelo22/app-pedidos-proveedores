require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Importar rutas
const proveedoresRoutes = require('./routes/proveedores');
const productosRoutes = require('./routes/productos');
const authenticateToken = require('./middlewares/auth');
const authRoutes = require('./routes/auth');

// Crear aplicación Express
const app = express();

// =============================================
// Conexión a MongoDB (asegúrate de tener MongoDB instalado o usa Atlas)
// =============================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pedidos-proveedores', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado exitosamente'))
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err.message);
  console.log('¿Tienes MongoDB instalado y corriendo?');
});

// =============================================
// Configuración de PostgreSQL (tu configuración actual)
// =============================================
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Gm240204',
  port: process.env.DB_PORT || 5432,
});

// Verificar conexión a PostgreSQL
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('✅ PostgreSQL conectado. Hora actual:', res.rows[0].now);
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// =============================================
// Rutas
// =============================================
app.get('/', (req, res) => {
  res.send('🏭 API de Pedidos a Proveedores');
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/proveedores', authenticateToken, proveedoresRoutes);
app.use('/api/productos', authenticateToken, productosRoutes);

// =============================================
// Manejo de errores
// =============================================
app.use((err, req, res, next) => {
  console.error('🔥 Error global:', err.stack);
  res.status(500).json({
    error: 'Algo salió mal en el servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// =============================================
// Iniciar servidor
// =============================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log('Configuración MongoDB:', process.env.MONGODB_URI || 'mongodb://localhost:27017/pedidos-proveedores');
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('❌ Error de conexión a MongoDB Atlas:', err.message);
  console.log('Revisa:');
  console.log('1. Tu cadena de conexión en .env');
  console.log('2. Que tu IP esté en la lista de permitidas en Atlas');
  console.log('3. Que tu usuario de Atlas tenga permisos');
});