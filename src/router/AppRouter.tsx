import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login, RegisterPage } from '../features/auth'
import { CatalogoHomePage } from '../features/catalogo'
import { CarritoHomePage } from '../features/carrito'
import { MisPedidosPage } from '../features/pedido'
import { PerfilClientePage } from '../features/perfilcliente'
import { EditarPerfilPage } from '../features/perfilcliente/pages/EditarPerfilPage'
import { NavBar } from '../shared/NavBar/NavBar'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/catalogo" replace />} />
        <Route path="/catalogo" element={<CatalogoHomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/carrito" element={<CarritoHomePage />} />
        <Route path="/pedidos" element={<MisPedidosPage />} />
        <Route path="/perfil" element={<PerfilClientePage />} />
        <Route path="/perfil/editar" element={<EditarPerfilPage />} />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}



