import { useState } from 'react'
import type { IDetallePedido, IPedido } from '../IPedido'
import { ESTADOS, FORMA_PAGO_LABEL, fmt } from './estadoConfig'
import { BarraEstado } from './BarraEstado'

interface TarjetaPedidoProps {
  pedido: IPedido & { detalles?: IDetallePedido[] }
  onLoadDetalles: (pedidoId: number) => void
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

export function TarjetaPedido({ pedido, onLoadDetalles }: TarjetaPedidoProps) {
  const [showDetalles, setShowDetalles] = useState(false)
  const estadoInfo = ESTADOS[pedido.estado_codigo]
  const esCancelado = pedido.estado_codigo === 'CANCELADO'
  const esEntregado = pedido.estado_codigo === 'ENTREGADO'
  const esActivo = !esCancelado && !esEntregado

  const toggleDetalles = () => {
    if (!showDetalles && !pedido.detalles) {
      onLoadDetalles(pedido.id)
    }
    setShowDetalles((v) => !v)
  }

  return (
    <article
      className={`rounded-[20px] overflow-hidden transition-all duration-200 border-[1.5px] ${
        esCancelado
          ? 'border-pink-200 bg-gradient-to-br from-[#fff5f7] to-[#fce4ec] hover:shadow-lg'
          : esActivo
          ? 'border-emerald-200 bg-[#fdfbd7] shadow-[0_4px_24px_0_rgba(31,136,72,0.10),0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_0_rgba(31,136,72,0.14),0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
          : 'border-[#e8e5c0] bg-[#fdfbd7] shadow-sm hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Header de la tarjeta */}
      <div className="flex justify-between items-start p-5 sm:px-6 border-b border-black/5">
        <div>
          {/* Chip de estado */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm">{estadoInfo.icon}</span>
            <span
              className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              style={{
                color: estadoInfo.color,
                backgroundColor: estadoInfo.bgColor,
              }}
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

        {/* Total */}
        <div
          className={`text-right rounded-2xl py-3 px-4.5 min-w-[100px] ${
            esCancelado
              ? 'bg-pink-100'
              : 'bg-gradient-to-br from-emerald-50 to-emerald-100'
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
      </div>

      {/* Barra de progreso */}
      <div className="px-5 py-5 sm:px-6">
        <BarraEstado estadoActual={pedido.estado_codigo} />
      </div>

      {/* Detalles (productos) */}
      <div className="border-t border-black/5 px-5 sm:px-6">
        {/* Toggle */}
        <button
          onClick={toggleDetalles}
          className="w-full bg-none border-none py-3.5 cursor-pointer flex items-center justify-between text-[#245433] hover:text-[#1F8848] text-xs font-bold transition-colors duration-200"
          id={`toggle-detalles-${pedido.id}`}
        >
          <span>Ver artículos del pedido</span>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            className={`transition-transform duration-300 ${showDetalles ? 'rotate-180' : 'rotate-0'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Lista de items */}
        {showDetalles && (
          <div className="pb-4 border-t border-dashed border-[#e8e5c0] pt-3.5 animate-fade-in">
            {pedido.detalles ? (
              pedido.detalles.length === 0 ? (
                <p className="text-gray-500 text-xs m-0">Sin detalles.</p>
              ) : (
                <ul className="m-0 p-0 list-none flex flex-col gap-2">
                  {pedido.detalles.map((d, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center py-2 px-3 bg-white/60 rounded-xl border border-[#e8e5c0]"
                    >
                      <span className="text-xs text-[#245433] font-semibold flex items-center">
                        <span className="inline-block min-w-[24px] bg-[#1F8848] text-white rounded-md px-1.5 py-0.5 text-[10px] font-extrabold mr-2 text-center">
                          {d.cantidad}x
                        </span>
                        {d.nombre_snapshot}
                      </span>
                      <span className="text-xs font-bold text-[#1F8848]">
                        {fmt(d.subtotal_snap)}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.636 15.364A9 9 0 1118.364 8.636" />
                </svg>
                Cargando artículos...
              </div>
            )}

            {/* Resumen de costos */}
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
}
