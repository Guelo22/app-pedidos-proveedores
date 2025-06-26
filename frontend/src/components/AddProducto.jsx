import { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import api from '../api/axios';


export default function AddProducto({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ nombre: '', precio: '', proveedor_id: '' });
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      const response = await api.get('/proveedores');
      setProveedores(response.data);
    };
    fetchProveedores();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/productos', {
        ...form,
        precio: parseFloat(form.precio)
      });
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nuevo Producto</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Proveedor"
          fullWidth
          value={form.proveedor_id}
          onChange={(e) => setForm({...form, proveedor_id: e.target.value})}
        >
          {proveedores.map((prov) => (
            <MenuItem key={prov.id} value={prov.id}>{prov.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={form.nombre}
          onChange={(e) => setForm({...form, nombre: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Precio"
          fullWidth
          type="number"
          value={form.precio}
          onChange={(e) => setForm({...form, precio: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}