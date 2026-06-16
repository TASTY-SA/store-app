import { useState } from 'react'
import type { IProducto } from '../../productos/IProducto'
import { useCartStore } from '../../../store/cartStore'
import { useAuthStore } from '../../../store/authStore'
import { RequireAuthModal } from '../../auth/components/RequireAuthModal'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

interface Props {
  producto: IProducto
  onClose: () => void
}

export function ProductDetailModal({ producto, onClose }: Props) {
  const addToCart = useCartStore((s) => s.addToCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [added, setAdded] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    addToCart(producto, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const tieneAlergenos = producto.ingredientes?.some((i) => i.es_alergeno)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#fffff0] border border-[#e8e5c0] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#245433]/60 shadow-sm transition-colors hover:bg-white hover:text-[#245433]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-56 sm:h-64">
          <img
            src={producto.imagen_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'}
            alt={producto.nombre}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'
            }}
          />
          {/* Category badge */}
          {producto.categorias && producto.categorias.length > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-[#1F8848]/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              {producto.categorias[0].nombre}
            </span>
          )}
          {/* Allergen badge */}
          {tieneAlergenos && (
            <span className="absolute bottom-3 left-3 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              ⚠️ Contiene alérgenos
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-6">
          {/* Name + price */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-xl font-black text-[#1a3a26] sm:text-2xl">
              {producto.nombre}
            </h2>
            <span className="shrink-0 text-xl font-black text-[#1F8848] sm:text-2xl">
              {fmt(producto.precio_base)} / {producto.unidad_medida.simbolo}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[#245433]/80">
            {producto.descripcion}
          </p>

          {/* Stock warning */}
          {producto.stock_cantidad <= 5 && (
            <p className="text-sm font-semibold text-red-600">
              ¡Solo quedan {producto.stock_cantidad} unidades!
            </p>
          )}

          {/* Categorías */}
          {producto.categorias && producto.categorias.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#245433]/50">
                Categorías
              </p>
              <div className="flex flex-wrap gap-2">
                {producto.categorias.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full border border-[#c5c89a] bg-white px-3 py-1 text-xs font-semibold text-[#245433]"
                  >
                    {cat.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredientes */}
          {producto.ingredientes && producto.ingredientes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#245433]/50">
                Ingredientes
              </p>
              <div className="flex flex-wrap gap-2">
                {producto.ingredientes.map((ing) => (
                  <span
                    key={ing.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      ing.es_alergeno
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-[#f7f6d8] text-[#245433] border border-[#e0ddba]'
                    }`}
                  >
                    {ing.nombre}
                    {ing.es_alergeno && ' ⚠️'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-bold text-white shadow-md transition-all active:scale-[0.98] ${
              added
                ? 'bg-emerald-600 shadow-emerald-600/30 cursor-default'
                : 'bg-[#1F8848] shadow-[#1F8848]/30 hover:bg-[#40A360]'
            }`}
          >
            {added ? (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Agregado!
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Agregar al carrito
              </>
            )}
          </button>
        </div>

        {showAuthModal && (
          <RequireAuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </div>
  )
}
