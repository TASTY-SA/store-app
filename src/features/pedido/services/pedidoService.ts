import { apiClient } from '../../auth/services/axiosInstance'
import type { IDetallePedido, IHistorialEstado, IPedidoCreate, IPedido, IPedidoList } from '../IPedido'

const BASE = '/api/v1/pedidos'

export const pedidoService = {
  /**
   * Crear un nuevo pedido (requiere autenticación)
   */
  async create(data: IPedidoCreate): Promise<IPedido> {
    const res = await apiClient.post<IPedido>(`${BASE}/`, data)
    return res.data
  },

  async getInitPoint(pedidoId: number): Promise<{ init_point: string }> {
    try {
      const response = await apiClient.post<{ init_point: string }>(`/api/v1/pagos/create-preference`, {
        pedido_id: pedidoId
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        console.error('Error al configurar la petición:', error.message);
      }
      throw error;
    }
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

  /**
   * Obtener el historial de transiciones de estado de un pedido
   */
  async getHistorial(pedidoId: number): Promise<IHistorialEstado[]> {
    const res = await apiClient.get<IHistorialEstado[]>(`${BASE}/${pedidoId}/historial`)
    return res.data
  },

  /**
   * Cancelar un pedido propio (solo PENDIENTE o CONFIRMADO)
   * El backend expone POST /api/v1/pedidos/{id}/cancel con estado_hacia: "CANCELADO"
   * y motivo obligatorio.
   */
  async cancelar(pedidoId: number, motivo: string): Promise<IPedido> {
    const res = await apiClient.post<IPedido>(`${BASE}/${pedidoId}/cancel`, {
      estado_hacia: 'CANCELADO',
      motivo,
    })
    return res.data
  },
}
