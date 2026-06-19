import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { IDetallePedido, IHistorialEstado, IPedido } from '../IPedido'
import { ESTADOS, FORMA_PAGO_LABEL, fmt } from './estadoConfig'
import { BarraEstado } from './BarraEstado'
import { TimelineEstado } from './TimelineEstado'

interface TarjetaPedidoProps {
  pedido: IPedido & { detalles?: IDetallePedido[]; historial?: IHistorialEstado[] }
  onLoadDetalles: (pedidoId: number) => void
  onLoadHistorial: (pedidoId: number) => void
  onCancel: (pedidoId: number, motivo: string) => Promise<void>
}

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

const PUEDE_CANCELAR = (codigo: string) =>
  codigo === 'PENDIENTE' || codigo === 'CONFIRMADO'

export function TarjetaPedido({ pedido, onLoadDetalles, onLoadHistorial, onCancel }: TarjetaPedidoProps) {
  const [showDetalles, setShowDetalles] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelMotivo, setCancelMotivo] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const estadoInfo = ESTADOS[pedido.estado_codigo]
  const esCancelado = pedido.estado_codigo === 'CANCELADO'
  const esEntregado = pedido.estado_codigo === 'ENTREGADO'
  const esActivo = !esCancelado && !esEntregado
  const puedeCancelar = PUEDE_CANCELAR(pedido.estado_codigo)

  const toggleDetalles = () => {
    if (!showDetalles && !pedido.detalles) {
      onLoadDetalles(pedido.id)
    }
    setShowDetalles((v) => !v)
  }

  const toggleTimeline = () => {
    if (!showTimeline && !pedido.historial) {
      onLoadHistorial(pedido.id)
    }
    setShowTimeline((v) => !v)
  }

  const handleCancel = async () => {
    setCancelling(true)
    setCancelError(null)
    try {
      await onCancel(pedido.id, cancelMotivo)
      setShowCancelConfirm(false)
      setCancelMotivo('')
    } catch (err: any) {
      setCancelError(err?.message ?? 'Error al cancelar el pedido.')
    } finally {
      setCancelling(false)
    }
  }

  const tarjeta = (
    <article
      className={`rounded-[20px] transition-all duration-200 border-[1.5px] ${
        esCancelado
          ? 'border-pink-200 bg-gradient-to-br from-[#fff5f7] to-[#fce4ec] hover:shadow-lg'
          : esActivo
          ? 'border-emerald-200 bg-[#fdfbd7] shadow-[0_4px_24px_0_rgba(31,136,72,0.10),0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_0_rgba(31,136,72,0.14),0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
          : 'border-[#e8e5c0] bg-[#fdfbd7] shadow-sm hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start p-5 sm:px-6 border-b border-black/5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm">{estadoInfo.icon}</span>
            <span
              className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              style={{ color: estadoInfo.color, backgroundColor: estadoInfo.bgColor }}
            >
              {estadoInfo.label}
            </span>
            {esActivo && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <h3 className="m-0 text-lg sm:text-xl font-black text-[#245433] tracking-tight">
            Pedido #{pedido.id}
          </h3>
          <p className="mt-1 text-xs text-gray-500 flex items-center gap-1.5">
            <span>{formatFecha(pedido.created_at)}</span>
            <span className="text-gray-300">•</span>
            <span>{FORMA_PAGO_LABEL[pedido.forma_pago_codigo] ?? pedido.forma_pago_codigo}</span>
          </p>
        </div>

        {/* Total + Cancel */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`text-right rounded-2xl py-3 px-4.5 min-w-[100px] ${
              esCancelado ? 'bg-pink-100' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'
            }`}
          >
            <p className="m-0 text-[11px] text-gray-500 font-semibold">Total</p>
            <p
              className={`mt-0.5 text-xl sm:text-2xl font-black tracking-tight ${
                esCancelado ? 'text-[#7b1f2a]' : 'text-[#1F8848]'
              }`}
            >
              {fmt(pedido.total)}
            </p>
          </div>
          {puedeCancelar && (
            <button
              onClick={() => { setCancelError(null); setShowCancelConfirm(true) }}
              className="text-[11px] font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200 transition-all active:scale-95"
            >
              Cancelar pedido
            </button>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      {!esCancelado && (
        <div className="px-5 py-5 sm:px-6">
          <BarraEstado estadoActual={pedido.estado_codigo} />
        </div>
      )}

      {/* Timeline */}
      <div className="border-t border-black/5 px-5 sm:px-6">
        <button
          onClick={toggleTimeline}
          className="w-full bg-none border-none py-3.5 cursor-pointer flex items-center justify-between text-[#245433] hover:text-[#1F8848] text-xs font-bold transition-colors duration-200"
        >
          <span>Timeline de estados</span>
          <svg
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
            className={`transition-transform duration-300 ${showTimeline ? 'rotate-180' : 'rotate-0'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showTimeline && (
          <div className="pb-4 border-t border-dashed border-[#e8e5c0] pt-3.5 animate-fade-in">
            <TimelineEstado historial={pedido.historial ?? []} loading={!pedido.historial} />
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="border-t border-black/5 px-5 sm:px-6">
        <button
          onClick={toggleDetalles}
          className="w-full bg-none border-none py-3.5 cursor-pointer flex items-center justify-between text-[#245433] hover:text-[#1F8848] text-xs font-bold transition-colors duration-200"
        >
          <span>Ver artículos del pedido</span>
          <svg
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
            className={`transition-transform duration-300 ${showDetalles ? 'rotate-180' : 'rotate-0'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDetalles && (
          <div className="pb-4 border-t border-dashed border-[#e8e5c0] pt-3.5 animate-fade-in">
            {pedido.detalles ? (
              pedido.detalles.length === 0 ? (
                <p className="text-gray-500 text-xs m-0">Sin detalles.</p>
              ) : (
                <ul className="m-0 p-0 list-none flex flex-col gap-2">
                  {pedido.detalles.map((d, i) => (
                    <li key={i} className="flex justify-between items-center py-2 px-3 bg-white/60 rounded-xl border border-[#e8e5c0]">
                      <span className="text-xs text-[#245433] font-semibold flex items-center">
                        <span className="inline-block min-w-[24px] bg-[#1F8848] text-white rounded-md px-1.5 py-0.5 text-[10px] font-extrabold mr-2 text-center">
                          {d.cantidad}x
                        </span>
                        {d.nombre_snapshot}
                      </span>
                      <span className="text-xs font-bold text-[#1F8848]">{fmt(d.subtotal_snap)}</span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.636 15.364A9 9 0 1118.364 8.636" />
                </svg>
                Cargando artículos...
              </div>
            )}
            {pedido.detalles && pedido.detalles.length > 0 && (
              <div className="mt-3 p-3 bg-white/50 rounded-xl border border-[#e8e5c0] flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>{fmt(pedido.subtotal)}</span>
                </div>
                {pedido.descuento > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Descuento</span>
                    <span>-{fmt(pedido.descuento)}</span>
                  </div>
                )}
                {pedido.costo_envio > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Costo de envío</span>
                    <span>{fmt(pedido.costo_envio)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#245433] border-t border-[#e8e5c0] mt-1 pt-1.5">
                  <span>Total</span>
                  <span className="text-[#1F8848]">{fmt(pedido.total)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )

  return (
    <>
      {tarjeta}

      {/* Modal de cancelación — renderizado con portal al body para evitar overflow bugs */}
      {showCancelConfirm &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowCancelConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#245433] text-center mb-2">
                ¿Cancelar pedido?
              </h3>
              <p className="text-sm text-[#245433]/70 text-center leading-relaxed mb-4">
                Esta acción no se puede deshacer. El pedido será cancelado y no podrá continuar.
              </p>

              {cancelError && (
                <div className="mb-4 rounded-xl bg-pink-50 border border-pink-200 px-4 py-3 text-xs font-semibold text-pink-800 text-center">
                  {cancelError}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Motivo de cancelación <span className="text-pink-500">*</span>
                </label>
                <textarea
                  value={cancelMotivo}
                  onChange={(e) => setCancelMotivo(e.target.value)}
                  placeholder="Contanos por qué cancelás el pedido..."
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] min-h-[70px] resize-none"
                  maxLength={200}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 rounded-xl border-2 border-[#c5c89a] bg-white py-2.5 text-sm font-bold text-[#245433] hover:bg-[#f7f6d8] transition-all active:scale-95"
                >
                  Volver
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling || !cancelMotivo.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-600/25 hover:shadow-lg hover:shadow-pink-600/35 transition-all active:scale-95 disabled:opacity-60"
                >
                  {cancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.636 15.364A9 9 0 1118.364 8.636" />
                      </svg>
                      Cancelando...
                    </span>
                  ) : (
                    'Sí, cancelar'
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
