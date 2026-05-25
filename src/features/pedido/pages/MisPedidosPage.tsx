import { Link } from 'react-router-dom'
import { NavBar } from '../../../shared/NavBar/NavBar'
import { useAuthStore } from '../../../store/authStore'
import { useMisPedidos } from '../hooks/useMisPedidos'
import { TarjetaPedido } from '../components/TarjetaPedido'
import type { IPedido } from '../IPedido'

function groupByStatus(pedidos: IPedido[]) {
  const activos = pedidos.filter(
    (p) => p.estado_codigo !== 'ENTREGADO' && p.estado_codigo !== 'CANCELADO'
  )
  const historial = pedidos.filter(
    (p) => p.estado_codigo === 'ENTREGADO' || p.estado_codigo === 'CANCELADO'
  )
  return { activos, historial }
}

export function MisPedidosPage() {
  const { isAuthenticated } = useAuthStore()
  const { pedidos, loading, error, refetch, loadDetalles } = useMisPedidos()
  const { activos, historial } = groupByStatus(pedidos)

  // Si no está autenticado, redirigir
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 w-full max-w-[860px] mx-auto px-5 pt-10 pb-20">
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#fdfbd7]/60 border-1.5 border-dashed border-[#c5c89a] rounded-[24px] gap-3">
            <div className="text-5xl mb-2">🔒</div>
            <h2 className="m-0 text-xl font-extrabold text-[#245433]">Inicia sesión para ver tus pedidos</h2>
            <p className="m-0 text-sm text-[#245433]/60 max-w-[320px] leading-relaxed">Necesitás estar autenticado para acceder al historial de pedidos.</p>
            <div className="flex gap-3 justify-center flex-wrap mt-2">
              <Link to="/login" className="inline-flex items-center gap-2 bg-[#1F8848] text-white rounded-2xl px-6 py-3 text-sm font-bold no-underline transition-all duration-200 shadow-lg shadow-[#1F8848]/25 hover:bg-[#40A360] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1F8848]/35 active:scale-95">
                Iniciar sesión
              </Link>
              <Link to="/catalogo" className="inline-flex items-center gap-2 bg-transparent text-[#245433] border-1.5 border-[#c5c89a] rounded-2xl px-6 py-3 text-sm font-bold no-underline transition-all duration-200 hover:border-[#1F8848] hover:text-[#1F8848] hover:bg-[#e8f5ec] active:scale-95">
                Ver catálogo
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
      <NavBar />

      <main className="flex-1 w-full max-w-[860px] mx-auto px-5 pt-10 pb-20">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
          <div>
            <h1 className="m-0 text-3xl sm:text-4xl font-black text-[#245433] tracking-tight">Mis Pedidos</h1>
            <p className="mt-2 text-sm text-[#245433]/65 max-w-[520px] leading-relaxed">
              Seguí el estado de tus pedidos en tiempo real.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-pink-50 border-1.5 border-pink-200 rounded-2xl p-4.5 text-sm text-[#7b1f2a] font-semibold mb-6 animate-fade-in">
            <span>⚠️ {error}</span>
            <button onClick={refetch} className="ml-auto bg-[#7b1f2a] text-white border-none rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-[#9b2f3c] transition-colors duration-200">
              Reintentar
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16 text-[#245433]/60 text-sm font-semibold">
            <div className="w-9 h-9 border-[3px] border-[#c8e6c9] border-t-[#1F8848] rounded-full animate-spin" />
            <p>Cargando pedidos...</p>
          </div>
        )}

        {/* Sin pedidos */}
        {!loading && !error && pedidos.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#fdfbd7]/60 border-1.5 border-dashed border-[#c5c89a] rounded-[24px] gap-3">
            <div className="text-5xl mb-2">🛍️</div>
            <h2 className="m-0 text-xl font-extrabold text-[#245433]">Todavía no hiciste ningún pedido</h2>
            <p className="m-0 text-sm text-[#245433]/60 max-w-[320px] leading-relaxed">Explorá nuestro menú y realizá tu primer pedido.</p>
            <Link to="/catalogo" className="mt-2 inline-flex items-center gap-2 bg-[#1F8848] text-white rounded-2xl px-6 py-3 text-sm font-bold no-underline transition-all duration-200 shadow-lg shadow-[#1F8848]/25 hover:bg-[#40A360] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1F8848]/35 active:scale-95">
              Explorar el menú
            </Link>
          </div>
        )}

        {/* Pedidos activos */}
        {!loading && activos.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-[#e8e5c0]">
              <h2 className="text-lg font-extrabold text-[#245433] m-0 flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                En Cocina
              </h2>
              <span className="inline-flex items-center justify-center bg-[#1F8848] text-white text-xs font-black rounded-full px-2.5 py-0.5 min-w-[28px]">
                {activos.length}
              </span>
            </div>
            <div className="flex flex-col gap-5">
              {activos.map((p) => (
                <TarjetaPedido key={p.id} pedido={p} onLoadDetalles={loadDetalles} />
              ))}
            </div>
          </section>
        )}

        {/* Historial */}
        {!loading && historial.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-[#e8e5c0]">
              <h2 className="text-lg font-extrabold text-[#245433] m-0 flex items-center gap-2.5" style={{ color: '#666' }}>
                Historial
              </h2>
              <span className="inline-flex items-center justify-center bg-[#e8e5c0] text-gray-600 text-xs font-black rounded-full px-2.5 py-0.5 min-w-[28px]">
                {historial.length}
              </span>
            </div>
            <div className="flex flex-col gap-5">
              {historial.map((p) => (
                <TarjetaPedido key={p.id} pedido={p} onLoadDetalles={loadDetalles} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
