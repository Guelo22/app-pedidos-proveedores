import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Delete as DeleteIcon,
  ChevronLeft,
  Close
} from '@mui/icons-material';
import {
  Typography,
  IconButton,
  Divider,
  Button,
  Badge,
  Box,
  Paper
} from '@mui/material';

export default function Carrito() {
  const { carrito, eliminarProducto, vaciarCarrito, confirmarPedido } = useCarrito();
  const { isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (!isAuthenticated || carrito.productos.length === 0) {
    return null;
  }

  const toggleExpand = () => setExpanded(!expanded);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        style={{
          position: 'fixed',
          right: '20px',
          top: '20px',
          width: expanded ? '350px' : 'auto',
          zIndex: 1000,
        }}
      >
        <Paper elevation={3} sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          width: '100%'
        }}>
          {/* Encabezado del carrito */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            {expanded ? (
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Mi Pedido
              </Typography>
            ) : (
              <Badge badgeContent={carrito.productos.length} color="secondary">
                <ShoppingCart />
              </Badge>
            )}

            <IconButton
              color="inherit"
              onClick={toggleExpand}
              size="small"
            >
              {expanded ? <Close /> : <ChevronLeft />}
            </IconButton>
          </Box>

          {/* Contenido expandible */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ p: 2 }}>
                  {/* Lista de productos */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {carrito.productos.map((producto) => (
                      <motion.div
                        key={producto.id}
                        variants={itemVariants}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                      >
                        <div>
                          <Typography style={{ fontWeight: '500' }}>{producto.nombre}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {producto.cantidad} x ${producto.precio.toFixed(2)}
                          </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography style={{ marginRight: '16px' }}>
                            ${(producto.precio * producto.cantidad).toFixed(2)}
                          </Typography>
                          <IconButton
                            onClick={() => eliminarProducto(producto.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Total y botones */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Divider style={{ margin: '16px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        Total:
                      </Typography>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        ${carrito.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0).toFixed(2)}
                      </Typography>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={vaciarCarrito}
                        fullWidth
                        style={{ textTransform: 'none' }}
                      >
                        Vaciar
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={confirmarPedido}
                        fullWidth
                        style={{ textTransform: 'none' }}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}