export type UserRole = "ADMIN" | "CLIENTE";

export interface IUser {
  id: number;
  user: string;
  password?: string;
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role_codes?: string[];
  role?: string;
}

export interface UserRegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password?: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string;
  isLoading?: boolean;
  error?: string | null;
  login: (credentials: { user: string; password: string }) => Promise<IUser | null>;
  logout: VoidFunction;
  checkAuth: () => Promise<boolean>;
  setError?: (err: string | null) => void;
  register?: (payload: UserRegisterPayload) => Promise<IUser>;
  clearSession?: () => void;
  hasRole?: (...roles: string[]) => boolean;
}
