import type { EstadoCodigo } from '../IPedido'
import { ESTADOS, ESTADOS_PROGRESO } from './estadoConfig'

interface BarraEstadoProps {
  estadoActual: EstadoCodigo
}

export function BarraEstado({ estadoActual }: BarraEstadoProps) {
  const esCancelado = estadoActual === 'CANCELADO'
  const ordenActual = ESTADOS[estadoActual].orden

  if (esCancelado) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-pink-100 border border-pink-200">
        <span className="font-bold text-[#7b1f2a] text-sm">
          Este pedido fue cancelado
        </span>
      </div>
    )
  }

  return (
    <div className="py-1">
      {/* Iconos + línea de progreso */}
      <div className="relative flex items-center">
        {/* Línea de fondo */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#e8e5c0] rounded -translate-y-1/2 z-0" />

        {/* Línea de progreso activa */}
        {(() => {
          const totalSteps = ESTADOS_PROGRESO.length - 1
          const currentStep = ESTADOS_PROGRESO.indexOf(estadoActual)
          const progressPct = currentStep > 0 ? (currentStep / totalSteps) * 100 : 0
          return (
            <div
              className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-emerald-500 to-[#1F8848] rounded -translate-y-1/2 z-10 transition-[width] duration-500 ease-out"
              style={{
                width: `calc(${progressPct}% * (100% - 32px) / 100)`,
              }}
            />
          )
        })()}

        {/* Pasos */}
        <div className="flex justify-between w-full relative z-20">
          {ESTADOS_PROGRESO.map((estado) => {
            const info = ESTADOS[estado]
            const isCompleted = info.orden < ordenActual
            const isActive = estado === estadoActual

            return (
              <div key={estado} className="flex flex-col items-center gap-1.5 flex-1">
                {/* Círculo del paso */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                    isCompleted || isActive ? 'bg-[#9ED496]' : 'bg-[#f7f6d8]'
                  } ${
                    isActive
                      ? 'border-[3px] border-[#47aa66] shadow-[0_0_0_4px_rgba(71,170,102,0.2)]'
                      : isCompleted
                      ? 'border-2 border-[#1F8848]'
                      : 'border-2 border-[#c5c89a]'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={isActive ? 'text-lg' : 'text-sm'}>
                      {info.icon}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] text-center whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'font-bold text-[#1F8848]' : isCompleted ? 'font-medium text-[#245433]' : 'font-medium text-gray-500'
                  }`}
                >
                  {info.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
