export type EstadoCodigo =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface IPedido {
  id: number
  usuario_id: number
  direccion_id: number | null
  estado_codigo: EstadoCodigo
  forma_pago_codigo: string
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IPedidoList {
  data: IPedido[]
  total: number
}

export interface IDetallePedido {
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snap: number
  personalizacion: number[] | null
}

export interface IPedidoCreate {
  direccion_id?: number | null
  forma_pago_codigo: string
  notas?: string | null
  items: {
    producto_id: number
    cantidad: number
    personalizacion?: number[] | null
  }[]
}
