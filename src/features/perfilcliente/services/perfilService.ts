import apiClient from "../../auth/services/axiosInstance";
import type { ICliente, DireccionPublic, DireccionCreate, DireccionUpdate, UserUpdatePayload } from "../IClientes";
import type { UserPublic } from "../../auth/types";

const AUTH = "/api/v1/auth";
const DIR = "/api/v1/direcciones";

/** Obtiene el perfil del usuario autenticado desde el backend. */
export async function getPerfilCliente(): Promise<ICliente> {
  const response = await apiClient.get<ICliente>(`${AUTH}/me`);
  return response.data;
}

/** Actualiza los datos del perfil del usuario autenticado. */
export async function actualizarPerfil(userId: number, data: UserUpdatePayload): Promise<UserPublic> {
  const response = await apiClient.patch<UserPublic>(`${AUTH}/usuarios/${userId}`, data);
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

/** Marca una dirección como principal (PATCH /direcciones/{id} con es_principal=true). */
export async function setDireccionPrincipal(id: number): Promise<DireccionPublic> {
  const response = await apiClient.patch<DireccionPublic>(`${DIR}/${id}`, { es_principal: true });
  return response.data;
}

/** Actualiza una dirección existente (PATCH /direcciones/{id}). */
export async function actualizarDireccion(id: number, data: DireccionUpdate): Promise<DireccionPublic> {
  const response = await apiClient.patch<DireccionPublic>(`${DIR}/${id}`, data);
  return response.data;
}

/** Elimina (soft-delete) una dirección por ID. */
export async function eliminarDireccion(id: number): Promise<void> {
  await apiClient.delete(`${DIR}/${id}`);
}
