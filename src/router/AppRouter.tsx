import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login, RegisterPage } from '../features/auth'
import { CatalogoHomePage } from '../features/catalogo'
import { CarritoHomePage } from '../features/carrito'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/catalogo" replace />} />
        <Route path="/catalogo" element={<CatalogoHomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/carrito" element={<CarritoHomePage />} />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}


