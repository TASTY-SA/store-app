import type { IHistorialEstado } from '../IPedido'
import { ESTADOS, fmt } from './estadoConfig'

interface Props {
  historial: IHistorialEstado[]
  loading?: boolean
}

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function TimelineEstado({ historial, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-xs text-gray-500">
        <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.636 15.364A9 9 0 1118.364 8.636" />
        </svg>
        Cargando historial...
      </div>
    )
  }

  if (!historial || historial.length === 0) return null

  const sorted = [...historial].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="relative pl-6">
      {/* Línea vertical */}
      <div className="absolute left-[9px] top-1 bottom-1 w-[2px] bg-[#e8e5c0]" />

      <div className="flex flex-col gap-0">
        {sorted.map((h, i) => {
          const info = ESTADOS[h.estado_hacia]
          const esCancelacion = h.estado_hacia === 'CANCELADO'
          const esCreacion = !h.estado_desde

          return (
            <div key={h.id ?? i} className="relative flex gap-3 pb-4 last:pb-0">
              {/* Punto en la timeline */}
              <div className="absolute -left-[23px] top-[3px] flex items-center justify-center">
                <div
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    esCancelacion
                      ? 'border-pink-400 bg-pink-100'
                      : esCreacion
                      ? 'border-emerald-400 bg-emerald-100'
                      : 'border-[#47aa66] bg-[#e8f5ec]'
                  }`}
                >
                  <div
                    className={`w-[6px] h-[6px] rounded-full ${
                      esCancelacion ? 'bg-pink-500' : 'bg-[#1F8848]'
                    }`}
                  />
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ color: info?.color, backgroundColor: info?.bgColor }}
                  >
                    {esCreacion ? 'Pedido creado' : info?.label ?? h.estado_hacia}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatFecha(h.created_at)}
                  </span>
                </div>

                {h.motivo && (
                  <p className="mt-1 text-xs text-[#7b1f2a] font-medium leading-relaxed">
                    Motivo: {h.motivo}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
