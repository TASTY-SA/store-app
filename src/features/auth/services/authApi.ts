import apiClient from "./axiosInstance";
import type { UserPublic, UserRegisterPayload } from "../types/index";

const AUTH = "/api/v1/auth";

/**
 * Login con OAuth2 Password Flow.
 *
 * El backend espera `application/x-www-form-urlencoded` (OAuth2PasswordRequestForm).
 * Responde con Set-Cookie: access_token=...; HttpOnly; SameSite=Lax.
 * El JWT nunca toca el código JavaScript.
 */
export async function requestLogin(
  username: string,
  password: string,
): Promise<void> {
  const body = new URLSearchParams({ username, password });
  await apiClient.post(`${AUTH}/token`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

/**
 * Registra un nuevo usuario. El backend devuelve el UserPublic creado.
 */
export async function requestRegister(
  payload: UserRegisterPayload,
): Promise<UserPublic> {
  const response = await apiClient.post<UserPublic>(
    `${AUTH}/register`,
    payload,
  );
  return response.data;
}

/**
 * Rehidrata el estado de autenticación desde el backend.
 * La cookie httpOnly viaja automáticamente — si es válida → 200 con UserPublic; si no → 401.
 */
export async function requestMe(): Promise<UserPublic> {
  const response = await apiClient.get<UserPublic>(`${AUTH}/me`);
  return response.data;
}

/** Le pide al backend que invalide la cookie httpOnly. */
export async function requestLogout(): Promise<void> {
  await apiClient.post(`${AUTH}/logout`);
}
