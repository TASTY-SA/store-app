import { apiClient } from '../../auth/services/axiosInstance'
import type { IDetallePedido, IPedidoCreate, IPedido, IPedidoList } from '../IPedido'

const BASE = '/pedidos'

export const pedidoService = {
  /**
   * Crear un nuevo pedido (requiere autenticación)
   */
  async create(data: IPedidoCreate): Promise<IPedido> {
    const res = await apiClient.post<IPedido>(`${BASE}/`, data)
    return res.data
  },

  /**
   * Obtener los pedidos del usuario autenticado
   */
  async getMisPedidos(): Promise<IPedidoList> {
    const res = await apiClient.get<IPedidoList>(`${BASE}/mis-pedidos`)
    return res.data
  },

  /**
   * Obtener un pedido por ID (para polling de estado)
   */
  async getById(id: number): Promise<IPedido> {
    const res = await apiClient.get<IPedido>(`${BASE}/${id}`)
    return res.data
  },

  /**
   * Obtener el detalle (items) de un pedido
   */
  async getDetalles(pedidoId: number): Promise<IDetallePedido[]> {
    const res = await apiClient.get<IDetallePedido[]>(`${BASE}/${pedidoId}/detalles`)
    return res.data
  },
}
