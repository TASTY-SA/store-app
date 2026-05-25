import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "../../../shared/NavBar/NavBar";
import { apiClient } from "../services/axiosInstance";


interface RegisterPayload {
  username: string;
  full_name: string;
  password: string;
  email: string;
}

/**
 * Página de Registro - Módulo Auth
 */
export function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterPayload>({
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
    setFormData((prev: RegisterPayload) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== passwordConfirm) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // Registrar en el backend
      await apiClient.post("/api/v1/auth/register", {
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Error al registrarse en el backend:", err);
      const msg = err.response?.data?.detail || "Error al registrarse. Intenta con otro usuario o email.";
      setLocalError(typeof msg === "string" ? msg : JSON.stringify(msg));
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
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Ingresa tu nombre completo"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Crea tu usuario"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Crea tu contraseña"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Confirma tu contraseña"
                  className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/30"
                />
              </div>

              <button
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
