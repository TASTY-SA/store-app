import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login, RegisterPage } from '../features/auth'
import { CatalogoHomePage } from '../features/catalogo'
import { CarritoHomePage } from '../features/carrito'
import { MisPedidosPage } from '../features/pedido'
import { PerfilClientePage } from '../features/perfilcliente'
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
        <Route
          path="/perfil/editar"
          element={
            <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
              <NavBar />
              <main className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="text-5xl animate-bounce">🛠️</div>
                <h1 className="text-3xl font-black">Editar Perfil</h1>
                <p className="text-sm text-[#245433]/70 max-w-xs leading-relaxed">
                  Esta funcionalidad estará disponible en la próxima actualización.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-[#245433] text-[#fdfbd7] px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-[#1f492c] transition-colors shadow-md"
                >
                  Volver al perfil
                </button>
              </main>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}



