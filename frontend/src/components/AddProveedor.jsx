import { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from '../api/client';

export default function AddProveedor({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });

  const handleSubmit = async () => {
    try {
      const response = await api.post('/proveedores', form);
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error('Error agregando proveedor:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nuevo Proveedor</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={form.nombre}
          onChange={(e) => setForm({...form, nombre: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          type="email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Teléfono"
          fullWidth
          value={form.telefono}
          onChange={(e) => setForm({...form, telefono: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}