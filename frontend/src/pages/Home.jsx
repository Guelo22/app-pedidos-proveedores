import { Container } from '@mui/material'
import Proveedores from '../components/Proveedores'
import Pedidos from '../components/Pedidos'
import AddProducto from '../components/AddProducto'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Proveedores />
      <Pedidos />
    </Container>
  )
}