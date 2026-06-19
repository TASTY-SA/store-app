// ─── Interfaces del Perfil de Cliente ─────────────────────────────────────────

export interface RolPublic {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
}

export interface ICliente {
  id: number;
  username: string;
  full_name: string;
  email: string;
  celular?: string | null;
  disabled: boolean;
  roles: RolPublic[];
  /** URL o data-URL de la foto de perfil (solo local/frontend) */
  foto_perfil?: string | null;
}

export interface DireccionPublic {
  id: number;
  usuario_id: number;
  alias?: string | null;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  provincia?: string | null;
  codigo_postal?: string | null;
  es_principal: boolean;
}

export interface DireccionCreate {
  alias?: string;
  linea1: string;
  linea2?: string;
  ciudad: string;
  provincia?: string;
  codigo_postal?: string;
  es_principal: boolean;
}

export interface DireccionUpdate {
  alias?: string;
  linea1?: string;
  linea2?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  es_principal?: boolean;
}

export interface UserUpdatePayload {
  full_name?: string;
  email?: string;
  celular?: string;
}

export interface Preferencias {
  notificaciones: boolean;
  idioma: string;
  modoGourmet: boolean;
}
