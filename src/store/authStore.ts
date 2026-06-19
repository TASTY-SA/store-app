import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../features/auth/services/authApi";
import type { UserPublic, UserRegisterPayload, UserRole } from "../features/auth/types";

/**
 * Store de autenticación basado en cookies httpOnly.
 *
 * Diseño (Zustand + cookies httpOnly):
 *  - El JWT NO vive en el frontend. Solo existe como cookie httpOnly
 *    administrada por el navegador y el backend.
 *  - Zustand persiste únicamente `accessToken` como hint de UI
 *    (saber si había sesión activa para mostrar skeleton en lugar de login).
 *    La rehidratación real siempre se hace vía `checkAuth()` → `/api/v1/auth/me`.
 *  - `accessToken` aquí es solo un indicador de presencia de sesión;
 *    la cookie httpOnly es el único token con valor de autenticación.
 */
interface AuthState {
  user: UserPublic | null;
  isAuthenticated: boolean;
  /**
   * Hint de UI persistido: indica que había una sesión activa en la última visita.
   * NO es el JWT real (que vive en cookie httpOnly). Solo se usa para mostrar
   * skeleton/spinner mientras `checkAuth()` verifica la sesión con el backend.
   */
  accessToken: string | null;
  // `isLoading` arranca en true para que la UI sepa que estamos verificando
  // la sesión contra el backend antes de mostrar login o contenido protegido.
  isLoading: boolean;
  error: string | null;

  /** Verifica si el usuario tiene al menos uno de los roles indicados */
  hasRole: (...roles: UserRole[]) => boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: UserRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  /** Rehidrata la sesión al iniciar la app leyendo la cookie desde el backend */
  checkAuth: () => Promise<void>;
  clearSession: () => void;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      isLoading: true,
      error: null,

      setError: (msg) => set({ error: msg }),

      hasRole: (...roles) => {
        const { user } = get();
        if (!user) return false;
        // El backend devuelve roles como array de RolPublic → comparamos por codigo
        return user.roles.some((r) => roles.includes(r.codigo as UserRole));
      },

      clearSession: () =>
        set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false, error: null }),

      // Rehidrata el store al iniciar la app. Si la cookie httpOnly sigue
      // siendo válida, el backend devuelve el usuario; si no, queda anónimo.
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.requestMe();
          set({ user, isAuthenticated: true, accessToken: 'active', isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false });
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.requestLogin(username, password);
          // El backend setea la cookie httpOnly en la respuesta del login.
          // Acto seguido pedimos /me para traer los datos del usuario.
          const user = await authApi.requestMe();
          set({ user, isAuthenticated: true, accessToken: 'active', isLoading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error de inicio de sesión";
          set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false, error: msg });
          throw e;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.requestRegister(payload);
          set({ isLoading: false });
          // Auto-login tras registrarse
          await get().login(payload.username, payload.password);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al registrarse";
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      logout: async () => {
        try {
          await authApi.requestLogout();
        } catch {
          // Aun si falla la red, limpiamos el estado local: el usuario
          // dejará de ver contenido protegido y un eventual 401 posterior
          // terminará de sincronizar la cookie.
        }
        set({ user: null, isAuthenticated: false, accessToken: null, error: null, isLoading: false });
      },
    }),
    {
      name: 'foodstore_auth',
      // Solo persistimos accessToken como hint de UI (no el JWT real).
      // La sesión siempre se revalida con checkAuth() → /auth/me al montar la app.
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
