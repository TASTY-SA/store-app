import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCartStore } from '../../../store/cartStore'
import { useAuthStore } from '../../../store/authStore'
import { NavBar } from '../../../shared/NavBar/NavBar'
import { CarritoItemCard } from '../components/CarritoItemCard'
import { ResumenPedido } from '../components/ResumenPedido'
import { CheckoutModal, type MetodoPago } from '../components/CheckoutModal'
import { RequireAuthModal } from '../../auth/components/RequireAuthModal'
import { pedidoService } from '../../pedido'

export function CarritoHomePage() {
  const { items, updateQuantity, updateNotes, removeFromCart, clearCart, subtotal, totalItems } =
    useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ── Estados ────────────────────────────────

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const costoEnvio = subtotal > 0 ? 500 : 0
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [mpSimulando, setMpSimulando] = useState(false)

  // ── Handlers ───────────────────────────────

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    if (items.length === 0) return

    // Mostrar el modal de checkout (dirección + pago)
    setShowCheckoutModal(true)
  }

  const handleCheckoutConfirm = useCallback(
    async ({
      metodo,
      direccionId,
    }: {
      metodo: MetodoPago
      direccionId?: number
    }) => {
      setCheckoutLoading(true)
      setCheckoutError(null)
      setShowCheckoutModal(false)

      try {
        // ── Juntar notas de todos los items ──────────
        const notasPedido = items
          .map((item) => item.notas?.trim())
          .filter(Boolean)
          .join(' | ') || null

        // ── Crear pedido ───────────────────────────
        const nuevoPedido = await pedidoService.create({
          forma_pago_codigo: metodo,
          direccion_id: direccionId ?? null,
          notas: notasPedido,
          items: items.map((item) => ({
            producto_id: item.producto.id!,
            cantidad: item.cantidad,
            notas: item.notas || null,
          })),
        })

        // Invalidar cache de pedidos para que se refleje el nuevo pedido
        queryClient.invalidateQueries({ queryKey: ['pedidos'] })

        if (metodo === 'MERCADOPAGO') {
          setMpSimulando(true)
          try {
            // Generar la preferencia de Mercado Pago usando el ID del pedido creado
            const { init_point } = await pedidoService.getInitPoint(nuevoPedido.id)
            if (init_point) {
              window.location.href = init_point
              return
            }
          } finally {
            setMpSimulando(false)
          }
        }

        clearCart()
        navigate('/pedidos')
      } catch (err: any) {
        const detail = err?.response?.data?.detail
        const msg =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: any) => d.msg).join(', ')
              : 'Ocurrió un error al procesar el pedido.'
        setCheckoutError(msg)
      } finally {
        setCheckoutLoading(false)
      }
    },
    [items, clearCart, navigate],
  )

  return (
    <div className="min-h-screen bg-[#f7f6d8] text-[#245433] flex flex-col">
      <NavBar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#245433] tracking-tight">Tu Carrito</h1>
          <p className="mt-2 text-sm text-[#245433]/65">
            Revisa tus selecciones y prepárate para disfrutar.
          </p>
        </div>

        {items.length === 0 ? (
          /* ── Carrito Vacío ───────────────────── */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#fdfbd7]/50 rounded-3xl border border-[#e8e5c0]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#245433]/5 text-[#245433]/40 mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#245433]">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-[#245433]/60 max-w-xs">
              Parece que aún no has agregado antojos a tu pedido.
            </p>
            <Link
              to="/catalogo"
              className="mt-6 rounded-2xl bg-[#1F8848] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#1F8848]/25 hover:bg-[#40A360] active:scale-95 transition-all"
            >
              Explorar el Menú
            </Link>
          </div>
        ) : (
          /* ── Contenido del Carrito (2 Columnas) ── */
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Listado de Artículos */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <CarritoItemCard
                  key={item.producto.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onUpdateNotes={updateNotes}
                  onRemove={removeFromCart}
                />
              ))}

              <Link
                to="/catalogo"
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c5c89a] bg-[#fdfbd7]/20 py-4 text-sm font-bold text-[#245433] hover:border-[#1F8848] hover:bg-[#fdfbd7]/50 hover:text-[#1F8848] transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                ¿Con más antojo? Explora el Menú
              </Link>
            </div>

            {/* Panel de Resumen */}
            <div className="w-full lg:w-[380px] shrink-0">
              <ResumenPedido
                subtotal={subtotal}
                totalItems={totalItems}
                costoEnvio={costoEnvio}
                onCheckout={handleCheckoutClick}
                loading={checkoutLoading}
                error={checkoutError}
              />
            </div>
          </div>
        )}
      </main>

      {/* ── Modal de autenticación ───────────── */}
      {showAuthModal && <RequireAuthModal onClose={() => setShowAuthModal(false)} />}

      {/* ── Modal de checkout (dirección + pago) ── */}
      {showCheckoutModal && (
        <CheckoutModal
          total={subtotal + costoEnvio}
          subtotal={subtotal}
          costoEnvio={costoEnvio}
          loading={checkoutLoading}
          error={checkoutError}
          onConfirm={handleCheckoutConfirm}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

      {/* ── Overlay de simulación MP ─────────── */}
      {mpSimulando && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] px-10 py-8 shadow-2xl">
            {/* Logo animado de MP */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-[#00BFFF]/10 animate-ping" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0099CC] shadow-lg">
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-extrabold text-[#245433]">
                Conectando con Mercado Pago...
              </p>
              <p className="mt-1 text-xs text-[#245433]/50">
                Estás siendo redirigido al portal de pago seguro.
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1F8848] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#1F8848] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#1F8848] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
