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
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-report">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
	<path d="M18 14v4h4" />
	<path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
	<path d="M8 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
	<path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
	<path d="M8 11h4" />
	<path d="M8 15h3" />
</svg>,
    color: '#245433',
    bgColor: '#e8f5ec',
    barColor: '#47aa66',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    orden: 2,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-checklist">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" />
	<path d="M14 19l2 2l4 -4" />
	<path d="M9 8h4" />
	<path d="M9 12h2" />
</svg>,
    color: '#1a5c8a',
    bgColor: '#e0f0fb',
    barColor: '#2196f3',
  },
  EN_PREP: {
    label: 'Cocinando',
    orden: 3,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tools-kitchen-2">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
</svg>,
    color: '#7a4b00',
    bgColor: '#fff3e0',
    barColor: '#ff9800',
  },
  EN_CAMINO: {
    label: 'En Camino',
    orden: 4,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-motorbike">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M2 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
	<path d="M16 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
	<path d="M7.5 14h5l4 -4h-10.5m1.5 4l4 -4" />
	<path d="M13 6h2l1.5 3l2 4" />
</svg>,
    color: '#4a1a7a',
    bgColor: '#f3e5f5',
    barColor: '#9c27b0',
  },
  ENTREGADO: {
    label: 'Entregado',
    orden: 5,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin-check">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
	<path d="M11.87 21.48a1.992 1.992 0 0 1 -1.283 -.58l-4.244 -4.243a8 8 0 1 1 13.355 -3.474" />
	<path d="M15 19l2 2l4 -4" />
</svg>,
    color: '#1a5c2a',
    bgColor: '#e8f5e9',
    barColor: '#4caf50',
  },
  CANCELADO: {
    label: 'Cancelado',
    orden: 0,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#699D64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cancel">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
	<path d="M18.364 5.636l-12.728 12.728" />
</svg>,
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
