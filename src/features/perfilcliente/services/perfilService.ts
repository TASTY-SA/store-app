import apiClient from "../../auth/services/axiosInstance";
import type { ICliente, DireccionPublic, DireccionCreate } from "../IClientes";

const AUTH = "/api/v1/auth";
const DIR = "/direcciones";

/** Obtiene el perfil del usuario autenticado desde el backend. */
export async function getPerfilCliente(): Promise<ICliente> {
  const response = await apiClient.get<ICliente>(`${AUTH}/me`);
  return response.data;
}

/** Lista todas las direcciones del usuario autenticado. */
export async function getDirecciones(): Promise<DireccionPublic[]> {
  const response = await apiClient.get<{ data: DireccionPublic[]; total: number }>(
    `${DIR}/?offset=0&limit=100`
  );
  return response.data.data;
}

/** Crea una nueva dirección para el usuario autenticado. */
export async function crearDireccion(data: DireccionCreate): Promise<DireccionPublic> {
  const response = await apiClient.post<DireccionPublic>(`${DIR}/`, data);
  return response.data;
}

/** Elimina (soft-delete) una dirección por ID. */
export async function eliminarDireccion(id: number): Promise<void> {
  await apiClient.delete(`${DIR}/${id}`);
}
