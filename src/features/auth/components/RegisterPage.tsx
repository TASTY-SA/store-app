import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "../../../shared/NavBar/NavBar";
import { useAuthStore } from "../../../store/authStore";
import type { UserRegisterPayload } from "../types";

/**
 * Página de Registro — usa useAuthStore.register() (Zustand + authApi)
 * para registrar y auto-loguear al usuario.
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [formData, setFormData] = useState<UserRegisterPayload>({
    username: "",
    full_name: "",
    password: "",
    email: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== passwordConfirm) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setLocalError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Pasa por Zustand → authApi.requestRegister → authApi.requestLogin → /me
      await register({
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess(true);
      // El store ya tiene al usuario autenticado gracias al auto-login
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: unknown } }; message?: string };
      const detail = axiosErr?.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail
          ? JSON.stringify(detail)
          : axiosErr?.message ?? "Error al registrarse. Intenta con otro usuario o email.";
      setLocalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6d8] text-[#245433] flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#47aa66]/25 bg-[#47aa66] text-xl font-black text-[#fdfbd7] shadow-lg shadow-[#47aa66]/20">
              FS
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#245433]">Crear Cuenta</h2>
            <p className="mt-1 text-sm text-[#245433]/65">Regístrate para realizar tus pedidos</p>
          </div>

          {success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center text-emerald-800 font-semibold">
              ¡Registro exitoso! Iniciando sesión…
            </div>
          ) : (
            <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
              {localError && (
                <div className="rounded-xl bg-[#7b1f2a]/10 border border-[#7b1f2a]/20 p-3 text-sm text-[#7b1f2a] font-medium">
                  {localError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Nombre Completo
                </label>
                <input
                  id="register-fullname"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Ingresa tu nombre completo"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Crea tu usuario"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Contraseña
                </label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  id="register-password-confirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Confirma tu contraseña"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:opacity-60"
                />
              </div>

              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-2xl bg-[#1F8848] py-3.5 text-sm font-bold text-white shadow-md shadow-[#1F8848]/20 transition-all hover:bg-[#40A360] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Creando cuenta…" : "Registrarse"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-[#245433]/70">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-[#1F8848] hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
