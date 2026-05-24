import type { IProducto } from "../IProducto";
import apiClient from "../../auth/services/axiosInstance";

const PATH = "/productos";

type PaginatedResponse = { data: IProducto[]; total: number };

export const getProductos = async (offset: number, limit: number): Promise<PaginatedResponse> => {
  const response = await apiClient.get<PaginatedResponse>(`${PATH}?offset=${0}&limit=${limit}`);
  return response.data;
};
