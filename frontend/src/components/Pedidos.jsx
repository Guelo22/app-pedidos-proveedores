import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';

export default function Pedidos() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    proveedor_id: '',
    productos: [{ id: '', cantidad: 1 }]
  });

  useEffect(() => {
    // Cargar proveedores y productos al iniciar
    axios.get('http://localhost:3001/api/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error cargando proveedores:', err));

    axios.get('http://localhost:3001/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

      // Obtén el token del localStorage
      const token = localStorage.getItem('token');

  axios.post('http://localhost:3001/api/pedidos', formData, {
    headers: {
      'Authorization': `Bearer ${token}` // ✅ Incluye el token
    }
  })
  .then(() => {
        alert('Pedido creado con éxito!');
        // Resetear formulario después de enviar
        setFormData({
          proveedor_id: '',
          productos: [{ id: '', cantidad: 1 }]
        });
      })
      .catch(err => {
        console.error('Error creando pedido:', err);
        alert('Hubo un error al crear el pedido');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { id: '', cantidad: 1 }]
    });
  };

  const removeProductField = (index) => {
    const newProductos = [...formData.productos];
    newProductos.splice(index, 1);
    setFormData({
      ...formData,
      productos: newProductos.length ? newProductos : [{ id: '', cantidad: 1 }]
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <Box
        component={motion.form}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 800,
          mx: 'auto',
          bgcolor: 'background.paper',
          '&:hover': {
            boxShadow: 6,
          },
          transition: 'all 0.3s ease',
        }}
      >
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel id="proveedor-label">Proveedor</InputLabel>
            <Select
              labelId="proveedor-label"
              label="Proveedor"
              value={formData.proveedor_id}
              onChange={(e) => setFormData({...formData, proveedor_id: e.target.value})}
              required
            >
              <MenuItem value="" disabled>Seleccione un proveedor</MenuItem>
              {proveedores.map(prov => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Box sx={{ my: 3 }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="outlined"
                onClick={addProductField}
                sx={{ mb: 2 }}
              >
                Añadir Producto
              </Button>
            </motion.div>

            {formData.productos.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                style={{ marginBottom: '16px' }}
              >
                <Box display="flex" gap={2} alignItems="center">
                  <FormControl fullWidth>
                    <InputLabel id={`producto-label-${index}`}>Producto</InputLabel>
                    <Select
                      labelId={`producto-label-${index}`}
                      label="Producto"
                      value={item.id}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[index].id = e.target.value;
                        setFormData({...formData, productos: newProductos});
                      }}
                      required
                    >
                      <MenuItem value="" disabled>Seleccione un producto</MenuItem>
                      {productos.map(prod => (
                        <MenuItem key={prod.id} value={prod.id}>
                          {prod.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    type="number"
                    label="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => {
                      const newProductos = [...formData.productos];
                      newProductos[index].cantidad = e.target.value;
                      setFormData({...formData, productos: newProductos});
                    }}
                    inputProps={{ min: 1 }}
                    required
                    sx={{ width: '120px' }}
                  />

                  {formData.productos.length > 1 && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeProductField(index)}
                        sx={{ minWidth: '40px' }}
                      >
                        ×
                      </Button>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: '24px' }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:disabled': {
                  opacity: 0.7
                }
              }}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5
                  }}
                >
                  Enviando...
                </motion.span>
              ) : (
                'Crear Pedido'
              )}
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </motion.div>
  );
}