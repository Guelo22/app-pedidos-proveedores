// src/components/Layout.jsx
import { Container, Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ minHeight: '80vh' }}>
          {children}
        </Box>
      </Container>
    </>
  );
}