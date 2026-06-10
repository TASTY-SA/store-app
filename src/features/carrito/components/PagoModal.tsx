import { useState } from 'react'

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────

export type MetodoPago = 'EFECTIVO' | 'MERCADOPAGO'

interface PagoModalProps {
  /** Subtotal para mostrar en el resumen */
  total: number
  /** Loading externo (creación del pedido) */
  loading?: boolean
  /** Error del proceso de checkout */
  error?: string | null
  /** Se llama cuando el usuario confirma un método de pago */
  onConfirm: (metodo: MetodoPago) => void
  /** Se llama al cerrar el modal sin confirmar */
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

const OPCIONES: PagoOption[] = [
  {
    id: 'EFECTIVO',
    label: 'Efectivo',
    descripcion: 'Pagás en efectivo cuando recibís tu pedido.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
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
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
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

export function PagoModal({
  total,
  loading = false,
  error = null,
  onConfirm,
  onClose,
}: PagoModalProps) {
  const [selected, setSelected] = useState<MetodoPago | null>(null)

  const handleConfirm = () => {
    if (!selected || loading) return
    onConfirm(selected)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#245433]/10 px-6 py-4">
          <div>
            <h3 className="text-xl font-black text-[#245433] tracking-tight">
              Seleccionar método de pago
            </h3>
            <p className="mt-1 text-xs text-[#245433]/60">
              Elegí cómo querés pagar tu pedido.
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

        {/* ── Opciones ──────────────────────────── */}
        <div className="flex flex-col gap-3 px-6 py-5">
          {OPCIONES.map((opcion) => {
            const isSelected = selected === opcion.id
            return (
              <button
                key={opcion.id}
                onClick={() => setSelected(opcion.id)}
                disabled={loading}
                className={`relative flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected
                    ? 'border-[#1F8848] bg-[#e8f5ec] shadow-md shadow-[#1F8848]/10'
                    : 'border-[#e8e5c0] bg-white hover:border-[#c5c89a] hover:shadow-sm'
                }`}
              >
                {/* Icono */}
                <div
                  className={`shrink-0 mt-0.5 ${
                    isSelected ? 'text-[#1F8848]' : 'text-[#245433]/50'
                  }`}
                >
                  {opcion.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-extrabold ${
                        isSelected ? 'text-[#1F8848]' : 'text-[#245433]'
                      }`}
                    >
                      {opcion.label}
                    </span>
                    {opcion.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1F8848]/10 text-[#1F8848] px-2 py-0.5 rounded-full">
                        {opcion.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#245433]/60 leading-relaxed">
                    {opcion.descripcion}
                  </p>
                </div>

                {/* Radio custom */}
                <div className="shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-[#1F8848] bg-[#1F8848]'
                        : 'border-[#c5c89a]'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Total ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#f7f6d8]/80 border-t border-[#e8e5c0] mx-6 rounded-2xl mb-2">
          <span className="text-sm font-bold text-[#245433]">Total a pagar</span>
          <span className="text-xl font-black text-[#1F8848]">{fmt(total)}</span>
        </div>

        {/* ── Error ──────────────────────────────── */}
        {error && (
          <div className="mx-6 mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {/* ── Acciones ──────────────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t border-[#245433]/10 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#245433] hover:bg-[#245433]/5 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
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
