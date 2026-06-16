import axios, { type AxiosError, type AxiosResponse } from "axios";
import { getApiBase } from "./config";
import { useAuthStore } from "../../../store/authStore";

/**
 * Cliente HTTP usando Axios
 *
 * Características:
 * - Base URL configurada desde .env
 * - Credentials incluidas (cookies httpOnly)
 * - Interceptores para request y response
 * - Manejo automático de errores 401 con revalidación de sesión
 *
 * Estrategia ante 401:
 *   1. Marca la request como ya reintentada (evita loops infinitos).
 *   2. Si ya hay otra request en proceso de revalidación, la encola.
 *   3. Llama a checkAuth() → GET /auth/me para ver si la cookie
 *      todavía es válida (ej: renovada por otra pestaña).
 *   4. Si checkAuth() funciona → reintenta todas las requests encoladas.
 *   5. Si no → limpia el estado de auth → la UI redirige al login.
 *
 * Nota: El backend actual usa cookie httpOnly sin refresh_token.
 *       Si en el futuro se agrega POST /auth/refresh, este interceptor
 *       se actualiza para intentarlo antes de checkAuth().
 */

export const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true, // Incluye cookies httpOnly
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Estado compartido del interceptor ──────────────────────────
// Evita que múltiples requests 401 intenten revalidar en paralelo.

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

function processQueue(error: unknown) {
  for (const { resolve, reject } of failedQueue) {
    if (error) reject(error)
    else resolve(undefined)
  }
  failedQueue = []
}

// ============================================================
// INTERCEPTOR DE REQUEST
// ============================================================
apiClient.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    console.error("Error en request:", error);
    return Promise.reject(error);
  },
);

// ============================================================
// INTERCEPTOR DE RESPONSE
// ============================================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as any;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Marcar para evitar reintentar este mismo request más de una vez
    originalRequest._retry = true;

    // Si ya hay un revalidate en curso, encolar este request
    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    isRefreshing = true;

    try {
      // Intentar re-validar contra el backend
      const store = useAuthStore.getState();
      await store.checkAuth();

      if (store.isAuthenticated) {
        // Cookie sigue siendo válida (renovada por otra pestaña)
        processQueue(null);
        return apiClient(originalRequest);
      }

      // Sesión expirada de verdad — limpiar estado
      store.clearSession();
      processQueue(error);
      return Promise.reject(error);
    } catch {
      // checkAuth falló (red, etc.) — limpiar igual
      useAuthStore.getState().clearSession();
      processQueue(error);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

// Alias para compatibilidad
export default apiClient;
