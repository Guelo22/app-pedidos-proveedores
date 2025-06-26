import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ExitToApp, Person, Store, ListAlt, Dashboard } from '@mui/icons-material';
import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { user, isProveedor, logout } = useAuth();
  const { carrito } = useCarrito();
  const [anchorEl, setAnchorEl] = useState(null);
  const [carritoAnchorEl, setCarritoAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const carritoOpen = Boolean(carritoAnchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCarritoClick = (event) => {
    event.preventDefault();
    setCarritoAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCarritoClose = () => {
    setCarritoAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{
      backgroundColor: 'primary.main',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      mb: 4,
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* Logo/Lado Izquierdo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Store sx={{
            mr: 1,
            fontSize: '2rem',
            color: 'secondary.main'
          }} />
          <Typography
            variant="h6"
            component={Link}
            to={isProveedor ? "/proveedor" : "/"}
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'white',
              '&:hover': {
                color: 'secondary.main'
              }
            }}
          >
            Sistema de Pedidos
          </Typography>
        </Box>

        {/* Menú/Lado Derecho */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {isProveedor ? (
                <Button
                  color="inherit"
                  component={Link}
                  to="/proveedor"
                  startIcon={<Dashboard />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Panel Proveedor
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/"
                    startIcon={<Store />}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Productos
                  </Button>

                  <Button
                    color="inherit"
                    component={Link}
                    to="/pedidos"
                    startIcon={<ListAlt />}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Mis Pedidos
                  </Button>

                  <IconButton
                    color="inherit"
                    onClick={handleCarritoClick}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <Badge badgeContent={carrito.productos.length} color="secondary">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </>
              )}

              {/* Menú de usuario */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  ml: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: 'success.main',
                        border: '2px solid white'
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    mt: 1.5,
                    minWidth: 180,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: '12px'
                  }
                }}
              >
                <MenuItem
                  component={Link}
                  to={isProveedor ? "/proveedor" : "/perfil"}
                  onClick={handleClose}
                  sx={{ py: 1.5 }}
                >
                  <Person sx={{ mr: 1.5 }} />
                  {isProveedor ? 'Panel Proveedor' : 'Mi Perfil'}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ExitToApp sx={{ mr: 1.5 }} /> Cerrar Sesión
                </MenuItem>
              </Menu>

              {/* Menú desplegable del Carrito (solo para clientes) */}
              {!isProveedor && (
                <Menu
                  anchorEl={carritoAnchorEl}
                  open={carritoOpen}
                  onClose={handleCarritoClose}
                  PaperProps={{
                    sx: {
                      width: 350,
                      maxHeight: '70vh',
                      p: 2,
                      mt: 1.5,
                      borderRadius: '12px'
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Mi Pedido
                  </Typography>

                  {carrito.productos.length > 0 ? (
                    <>
                      <Box sx={{ maxHeight: '50vh', overflow: 'auto', mb: 2 }}>
                        {carrito.productos.map((producto) => (
                          <Box key={producto.id} sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}>
                            <Box>
                              <Typography>{producto.nombre}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {producto.cantidad} x ${producto.precio.toFixed(2)}
                              </Typography>
                            </Box>
                            <Typography>
                              ${(producto.precio * producto.cantidad).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography fontWeight="bold">Total:</Typography>
                        <Typography fontWeight="bold">
                          ${carrito.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0).toFixed(2)}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/pedidos"
                        onClick={handleCarritoClose}
                      >
                        Ver Pedido Completo
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Tu carrito está vacío
                    </Typography>
                  )}
                </Menu>
              )}
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              startIcon={<Person />}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                }
              }}
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}