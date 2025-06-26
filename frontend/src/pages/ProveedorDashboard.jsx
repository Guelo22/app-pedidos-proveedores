import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api/axios';

export default function ProveedorDashboard() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const response = await api.get('/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
      }
    };
    
    cargarPedidos();
    
    // Opcional: Configurar polling o WebSocket para actualizaciones en tiempo real
    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel del Proveedor
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Pedidos Recibidos
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        {pedidos.length > 0 ? (
          <List>
            {pedidos.map((pedido, index) => (
              <React.Fragment key={pedido.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Pedido #${pedido.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Cliente: {pedido.cliente_email}
                        </Typography>
                        <br />
                        {`Total: $${pedido.total.toFixed(2)} - ${new Date(pedido.fecha).toLocaleString()}`}
                      </>
                    }
                  />
                </ListItem>
                {index < pedidos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1">No hay pedidos pendientes</Typography>
        )}
      </Paper>
    </Box>
  );
}