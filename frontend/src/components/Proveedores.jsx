import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  // Cargar proveedores
  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/proveedores', {
        headers: {
          'Authorization': 'Bearer ${token}'
        }
      });
      setProveedores(response.data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  // Filtrar proveedores
  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar nuevo proveedor
  const agregarProveedor = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/proveedores', newProveedor, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProveedores([...proveedores, response.data]);
      setOpenDialog(false);
      setNewProveedor({ nombre: '', email: '', telefono: '' });
    } catch (error) {
      console.error('Error agregando proveedor:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Buscar proveedores..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mr: 2 }}
          >
            Nuevo Proveedor
          </Button>
          <IconButton onClick={cargarProveedores}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProveedores.length > 0 ? (
                filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id} hover>
                    <TableCell>{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.email}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="textSecondary">
                      No se encontraron proveedores
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para nuevo proveedor */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={newProveedor.nombre}
            onChange={(e) => setNewProveedor({...newProveedor, nombre: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            type="email"
            value={newProveedor.email}
            onChange={(e) => setNewProveedor({...newProveedor, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            variant="outlined"
            value={newProveedor.telefono}
            onChange={(e) => setNewProveedor({...newProveedor, telefono: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={agregarProveedor}
            variant="contained"
            disabled={!newProveedor.nombre || !newProveedor.email}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}