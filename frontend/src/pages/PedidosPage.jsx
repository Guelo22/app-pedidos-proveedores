import React, { useState } from 'react';
import {
  Snackbar,
  Alert,
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import Productos from '../components/Productos';

export default function PedidosPage() {
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseFeedback = () => {
    setFeedback(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Encabezado */}
      <Paper elevation={0} sx={{
        p: 3,
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: 0
      }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1">
            Catálogo de Productos
          </Typography>
          <Typography variant="subtitle1">
            Selecciona los productos que deseas ordenar
          </Typography>
        </Container>
      </Paper>

      {/* Contenido principal - Catálogo a ancho completo */}
      <Box sx={{
        width: '100%',
        py: 4,
        px: 0  // Eliminamos el padding horizontal para máximo ancho
      }}>
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Productos
            onAddToCart={() => setFeedback({
              open: true,
              message: 'Producto agregado al carrito',
              severity: 'success'
            })}
          />
        </Container>
      </Box>

      {/* Notificación */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}