import type { ICategoria } from "../ICategoria";
import apiClient from "../../auth/services/axiosInstance";

const PATH = "/api/v1/categorias";

export const createCategory = async (
  newCategory: Omit<ICategoria, "id">,
): Promise<ICategoria> => {
  const res = await apiClient.post<ICategoria>(`${PATH}/`, newCategory);
  return res.data;
};

export const getCategorias = async (): Promise<{ data: ICategoria[]; total: number }> => {
  const res = await apiClient.get<{ data: ICategoria[]; total: number }>(`${PATH}/?offset=0&limit=100`);
  return res.data;
};

export const getCategoriaById = async (id: number): Promise<ICategoria> => {
  const res = await apiClient.get<ICategoria>(`${PATH}/${id}`);
  return res.data;
};

export const updateCategory = async (
  id: string,
  category: Partial<ICategoria>,
): Promise<ICategoria> => {
  const { nombre, descripcion, imagen_url, parent_id } = category;
  const body = { nombre, descripcion, imagen_url, parent_id };

  const res = await apiClient.patch<ICategoria>(`${PATH}/${id}`, body);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${PATH}/${id}`);
};
