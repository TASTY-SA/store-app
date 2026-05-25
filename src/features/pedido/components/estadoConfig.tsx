import type { EstadoCodigo } from '../IPedido'

interface EstadoInfo {
  label: string
  orden: number
  icon: string
  color: string
  bgColor: string
  barColor: string
}

export const ESTADOS: Record<EstadoCodigo, EstadoInfo> = {
  PENDIENTE: {
    label: 'Recibido',
    orden: 1,
    icon: '',
    color: '#245433',
    bgColor: '#e8f5ec',
    barColor: '#47aa66',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    orden: 2,
    icon: '',
    color: '#1a5c8a',
    bgColor: '#e0f0fb',
    barColor: '#2196f3',
  },
  EN_PREP: {
    label: 'Cocinando',
    orden: 3,
    icon: '',
    color: '#7a4b00',
    bgColor: '#fff3e0',
    barColor: '#ff9800',
  },
  EN_CAMINO: {
    label: 'En Camino',
    orden: 4,
    icon: '',
    color: '#4a1a7a',
    bgColor: '#f3e5f5',
    barColor: '#9c27b0',
  },
  ENTREGADO: {
    label: 'Entregado',
    orden: 5,
    icon: '',
    color: '#1a5c2a',
    bgColor: '#e8f5e9',
    barColor: '#4caf50',
  },
  CANCELADO: {
    label: 'Cancelado',
    orden: 0,
    icon: 'X',
    color: '#7b1f2a',
    bgColor: '#fce4ec',
    barColor: '#e91e63',
  },
}

// Orden de la barra de progreso (excluye CANCELADO)
export const ESTADOS_PROGRESO: EstadoCodigo[] = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREP',
  'EN_CAMINO',
  'ENTREGADO',
]

export const FORMA_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  MERCADOPAGO: 'MercadoPago',
}

export const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
