import { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState({
    proveedor: null,
    productos: []
  });

const agregarProducto = (producto) => {
  setCarrito(prev => {
    // Validar que el producto sea del proveedor seleccionado
    if (prev.proveedor && prev.proveedor.id !== producto.proveedor_id) {
      throw new Error('No puedes mezclar productos de diferentes proveedores');
    }

    const productoExistente = prev.productos.find(p => p.id === producto.id);

    if (productoExistente) {
      return {
        ...prev,
        productos: prev.productos.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        )
      };
    } else {
      // Si es el primer producto, establecer el proveedor
      const proveedor = prev.proveedor || { id: producto.proveedor_id };
      return {
        proveedor,
        productos: [...prev.productos, { ...producto, cantidad: 1 }]
      };
    }
  });
};

  const eliminarProducto = (productoId) => {
    setCarrito(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== productoId)
    }));
  };

  const vaciarCarrito = () => {
    setCarrito({ proveedor: null, productos: [] });
  };

  const seleccionarProveedor = (proveedor) => {
    setCarrito(prev => ({ ...prev, proveedor }));
  };

  const actualizarCantidad = (productoId, cantidad) => {
    setCarrito(prev => ({
      ...prev,
      productos: prev.productos.map(p =>
        p.id === productoId ? { ...p, cantidad } : p
      )
    }));
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        seleccionarProveedor,
        actualizarCantidad
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};