// ─── Tipos alineados con el backend (FastAPI + SQLModel) ──────────────────────

/** Rol público tal como lo devuelve el backend en UserPublic.roles[] */
export interface RolPublic {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
}

/** Vista pública del usuario que devuelve el backend en /auth/me */
export interface UserPublic {
  id: number;
  username: string;
  full_name: string;
  email: string;
  disabled: boolean;
  roles: RolPublic[];
}

/** Payload para registrar un nuevo usuario */
export interface UserRegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password: string; // mínimo 8 chars (validado en backend)
}

/** Roles posibles (códigos que usa el backend) */
export type UserRole = "ADMIN" | "CLIENTE" | "PEDIDOS";
