import type { ICategoria } from "../../categoria/ICategoria";
import apiClient from "../../auth/services/axiosInstance";

const PATH = "/api/v1/categorias";

export const getCategorias = async (): Promise<{ data: ICategoria[]; total: number }> => {
  const res = await apiClient.get<{ data: ICategoria[]; total: number }>(`${PATH}/?offset=0&limit=100`);
  return res.data;
};

export const getCategoriaById = async (id: number): Promise<ICategoria> => {
  const res = await apiClient.get<ICategoria>(`${PATH}/${id}`);
  return res.data;
};
