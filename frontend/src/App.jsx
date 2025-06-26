import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoContext';
import PedidosPage from './pages/PedidosPage';
import ProveedorDashboard from './pages/ProveedorDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <CarritoProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CarritoProvider>
  );
}

function AppContent() {
  const { isAuthenticated, isProveedor } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/proveedor" element={
          <ProtectedRoute allowedRoles={['proveedor']}>
            <ProveedorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/pedidos" element={
          <ProtectedRoute allowedRoles={['cliente']}>
            <PedidosPage />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            {isProveedor ? (
              <Navigate to="/proveedor" replace />
            ) : (
              <Home />
            )}
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isAuthenticated && !isProveedor && <Carrito />}
    </>
  );
}

export default App;