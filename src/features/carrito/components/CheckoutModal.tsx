import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDirecciones } from '../../perfilcliente/services/perfilService'

// ──────────────────────────────────────────────
// Tipos públicos
// ──────────────────────────────────────────────

export type MetodoPago = 'EFECTIVO' | 'MERCADOPAGO'

interface CheckoutModalProps {
  total: number
  subtotal?: number
  costoEnvio?: number
  descuento?: number
  loading?: boolean
  error?: string | null
  onConfirm: (data: { metodo: MetodoPago; direccionId?: number }) => void
  onClose: () => void
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

// ──────────────────────────────────────────────
// Opciones de pago
// ──────────────────────────────────────────────

interface PagoOption {
  id: MetodoPago
  label: string
  descripcion: string
  icon: React.ReactNode
  badge?: string
}

const OPCIONES_PAGO: PagoOption[] = [
  {
    id: 'EFECTIVO',
    label: 'Efectivo',
    descripcion: 'Pagás en efectivo cuando recibís tu pedido.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M12 18h4M32 30h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'MERCADOPAGO',
    label: 'Tarjeta / Mercado Pago',
    descripcion: 'Pagá con tarjeta de crédito, débito o desde tu cuenta de Mercado Pago.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <rect x="4" y="14" width="40" height="22" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="8" y="18" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="33" cy="27" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M30 27h6M33 24v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 14L24 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    badge: 'Recomendado',
  },
]

// ──────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────

export function CheckoutModal({
  total,
  subtotal,
  costoEnvio,
  descuento = 0,
  loading = false,
  error = null,
  onConfirm,
  onClose,
}: CheckoutModalProps) {
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null)
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null)

  // ── Cargar direcciones ─────────────────────
  const {
    data: direcciones = [],
    isLoading: dirsLoading,
  } = useQuery({
    queryKey: ['direcciones'],
    queryFn: getDirecciones,
    staleTime: 1000 * 60,
  })

  // Preseleccionar la dirección principal al cargar
  const hasPreselected = useState(() => {
    // Marcamos que en el primer render con datos,
    // si hay una principal, la seleccionamos.
    return false
  })

  // Si hay direcciones y ninguna seleccionada, elegir la principal
  if (direcciones.length > 0 && selectedDirId === null && !hasPreselected[0]) {
    const principal = direcciones.find((d) => d.es_principal)
    if (principal) {
      setSelectedDirId(principal.id)
    } else {
      setSelectedDirId(direcciones[0].id)
    }
    hasPreselected[1](true)
  }

  const canConfirm = selectedMetodo !== null && selectedDirId !== null

  const handleConfirm = () => {
    if (!canConfirm || loading) return
    onConfirm({
      metodo: selectedMetodo,
      direccionId: selectedDirId,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#245433]/10 px-6 py-4 sticky top-0 bg-[#fdfbd7] z-10 rounded-t-3xl">
          <div>
            <h3 className="text-xl font-black text-[#245433] tracking-tight">
              Finalizar Pedido
            </h3>
            <p className="mt-1 text-xs text-[#245433]/60">
              Revisá los datos y confirmá tu compra.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-1.5 text-[#245433]/50 hover:bg-[#245433]/5 hover:text-[#245433] transition-colors disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* ══════════════════════════════════════
            SECCIÓN: DIRECCIÓN DE ENVÍO
            ══════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#1F8848]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <h4 className="text-sm font-extrabold text-[#245433] tracking-tight">
                Dirección de envío
              </h4>
            </div>

            {dirsLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-[72px] rounded-2xl bg-[#e8e5c0]/40 animate-pulse" />
                ))}
              </div>
            ) : direcciones.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#c5c89a] bg-[#f7f6d8]/60 p-5 text-center">
                <svg className="w-8 h-8 mx-auto text-[#245433]/30 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="text-sm font-semibold text-[#245433]/60 mb-1">
                  No tenés direcciones guardadas
                </p>
                <p className="text-xs text-[#245433]/40 mb-3">
                  Agregá una desde tu perfil para poder recibir pedidos.
                </p>
                <a
                  href="/perfil"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8848] hover:text-[#40A360] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Ir a mis direcciones
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {direcciones.map((dir) => (
                  <button
                    key={dir.id}
                    onClick={() => setSelectedDirId(dir.id)}
                    disabled={loading}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      selectedDirId === dir.id
                        ? 'border-[#1F8848] bg-[#e8f5ec] shadow-md shadow-[#1F8848]/10'
                        : 'border-[#e8e5c0] bg-white hover:border-[#c5c89a] hover:shadow-sm'
                    }`}
                  >
                    {/* Icono de mapa */}
                    <div className={`shrink-0 mt-0.5 ${selectedDirId === dir.id ? 'text-[#1F8848]' : 'text-[#245433]/40'}`}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {dir.alias && (
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              selectedDirId === dir.id
                                ? 'bg-[#1F8848]/10 text-[#1F8848]'
                                : 'bg-[#245433]/8 text-[#245433]/60'
                            }`}
                          >
                            {dir.alias}
                          </span>
                        )}
                        {dir.es_principal && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1F8848]/10 text-[#1F8848] px-2 py-0.5 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#245433] mt-0.5">{dir.linea1}</p>
                      <p className="text-xs text-[#245433]/55">
                        {dir.ciudad}
                        {dir.provincia ? `, ${dir.provincia}` : ''}
                        {dir.codigo_postal ? ` (${dir.codigo_postal})` : ''}
                      </p>
                    </div>

                    {/* Radio */}
                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedDirId === dir.id
                            ? 'border-[#1F8848] bg-[#1F8848]'
                            : 'border-[#c5c89a]'
                        }`}
                      >
                        {selectedDirId === dir.id && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════
            SECCIÓN: MÉTODO DE PAGO
            ══════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#1F8848]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <h4 className="text-sm font-extrabold text-[#245433] tracking-tight">
                Método de pago
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              {OPCIONES_PAGO.map((opcion) => {
                const isSelected = selectedMetodo === opcion.id
                return (
                  <button
                    key={opcion.id}
                    onClick={() => setSelectedMetodo(opcion.id)}
                    disabled={loading}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? 'border-[#1F8848] bg-[#e8f5ec] shadow-md shadow-[#1F8848]/10'
                        : 'border-[#e8e5c0] bg-white hover:border-[#c5c89a] hover:shadow-sm'
                    }`}
                  >
                    {/* Icono */}
                    <div className={`shrink-0 mt-0.5 ${isSelected ? 'text-[#1F8848]' : 'text-[#245433]/40'}`}>
                      {opcion.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-extrabold ${isSelected ? 'text-[#1F8848]' : 'text-[#245433]'}`}
                        >
                          {opcion.label}
                        </span>
                        {opcion.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1F8848]/10 text-[#1F8848] px-2 py-0.5 rounded-full">
                            {opcion.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#245433]/60 leading-relaxed">
                        {opcion.descripcion}
                      </p>
                    </div>

                    {/* Radio */}
                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#1F8848] bg-[#1F8848]'
                            : 'border-[#c5c89a]'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* ── Total ────────────────────────────── */}
        <div className="mx-6 mb-2">
          <div className="p-4 bg-[#f7f6d8]/80 border border-[#e8e5c0] rounded-2xl">
            <div className="flex flex-col gap-1.5 text-xs">
              {subtotal !== undefined && (
                <div className="flex justify-between text-[#245433]/70">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
              )}
              {descuento > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Descuento</span>
                  <span>-{fmt(descuento)}</span>
                </div>
              )}
              {costoEnvio !== undefined && costoEnvio > 0 && (
                <div className="flex justify-between text-[#245433]/70">
                  <span>Envío</span>
                  <span>{fmt(costoEnvio)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#e8e5c0]">
              <span className="text-sm font-bold text-[#245433]">Total a pagar</span>
              <span className="text-xl font-black text-[#1F8848]">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Error ────────────────────────────── */}
        {error && (
          <div className="mx-6 mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {/* ── Acciones ────────────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t border-[#245433]/10 px-6 py-4 sticky bottom-0 bg-[#fdfbd7] rounded-b-3xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#245433] hover:bg-[#245433]/5 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className="flex items-center gap-2 rounded-xl bg-[#1F8848] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#1F8848]/20 transition-all hover:bg-[#40A360] active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar pedido</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
