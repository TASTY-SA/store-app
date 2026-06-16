import { useWsStore } from '../../store/wsStore'

const ETIQUETAS: Record<string, string> = {
  connected: 'Tiempo real activo',
  disconnected: 'Sin conexión en tiempo real',
  reconnecting: 'Reconectando…',
}

const COLORES: Record<string, string> = {
  connected: 'bg-green-500',
  disconnected: 'bg-red-500',
  reconnecting: 'bg-yellow-500',
}

export function WsStatusBadge() {
  const status = useWsStore((s) => s.status)

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
      <span
        className={`inline-block h-2 w-2 rounded-full ${COLORES[status] ?? 'bg-zinc-400'}`}
      />
      {ETIQUETAS[status] ?? status}
    </span>
  )
}
