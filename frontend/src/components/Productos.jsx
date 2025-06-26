import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  InputAdornment, Button, Chip, Box,
  Typography, Dialog, DialogActions,
  DialogContent, DialogTitle, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import api from '../api/axios';
import { useCarrito } from '../context/CarritoContext';

export default function Productos({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    search: '',
    minPrecio: '',
    maxPrecio: '',
    minStock: '',
    proveedorId: ''
  });
  const [proveedores, setProveedores] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const { agregarProducto } = useCarrito();

  const cargarProductos = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/productos?${params.toString()}`);
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const response = await api.get('/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarProveedores();
  }, [filtros]);

  const handleSyncInventory = async () => {
    try {
      const response = await api.post('/productos/sync-inventory', {
        productos: [
          { sku: 'PROD-001', precio: 19.99, stock: 50 },
          { sku: 'PROD-002', precio: 29.99, stock: 30 }
        ]
      });
      alert(response.data.message);
      cargarProductos();
    } catch (error) {
      console.error('Error sincronizando:', error);
      alert('Error al sincronizar inventario');
    }
  };

  const handleAgregarAlCarrito = async (producto) => {
    try {
      await agregarProducto({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        proveedor_id: producto.proveedor_id
      });

      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <TextField
          placeholder="Buscar productos..."
          value={filtros.search}
          onChange={(e) => setFiltros({...filtros, search: e.target.value})}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setOpenFilters(true)}
        >
          Filtros
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSyncInventory}
        >
          Sincronizar Inventario
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.id}
                hover
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <TableCell>
                  {producto.imagenes?.length > 0 && (
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {producto.descripcion}
                  </Typography>
                </TableCell>
                <TableCell>
                  {producto.precio ? `$${Number(producto.precio).toFixed(2)}` : '$0.00'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={producto.stock}
                    color={producto.stock > 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{producto.proveedor_nombre}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAgregarAlCarrito(producto);
                    }}
                    sx={{
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openFilters} onClose={() => setOpenFilters(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filtrar Productos</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label="Proveedor"
              value={filtros.proveedorId}
              onChange={(e) => setFiltros({...filtros, proveedorId: e.target.value})}
              fullWidth
            >
              <MenuItem value="">Todos los proveedores</MenuItem>
              {proveedores.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>{prov.nombre}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Precio mínimo"
                type="number"
                value={filtros.minPrecio}
                onChange={(e) => setFiltros({...filtros, minPrecio: e.target.value})}
                fullWidth
              />
              <TextField
                label="Precio máximo"
                type="number"
                value={filtros.maxPrecio}
                onChange={(e) => setFiltros({...filtros, maxPrecio: e.target.value})}
                fullWidth
              />
            </Box>

            <TextField
              label="Stock mínimo"
              type="number"
              value={filtros.minStock}
              onChange={(e) => setFiltros({...filtros, minStock: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFiltros({
                search: '',
                minPrecio: '',
                maxPrecio: '',
                minStock: '',
                proveedorId: ''
              });
              setOpenFilters(false);
            }}
            color="error"
          >
            Limpiar filtros
          </Button>
          <Button
            onClick={() => setOpenFilters(false)}
            variant="contained"
          >
            Aplicar filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}