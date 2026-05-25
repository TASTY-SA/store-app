import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { NavBar } from "../../../shared/NavBar/NavBar";

export const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const ok = await login({ user, password });
    if (!ok) {
      setError('Credenciales inválidas');
      return;
    }
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#f7f6d8] text-[#245433] flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#47aa66]/25 bg-[#47aa66] text-xl font-black text-[#fdfbd7] shadow-lg shadow-[#47aa66]/20">
              FS
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#245433]">Iniciar Sesión</h2>
            <p className="mt-1 text-sm text-[#245433]/65">Accede a tu cuenta para realizar pedidos</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-[#7b1f2a]/10 border border-[#7b1f2a]/20 p-3 text-sm text-[#7b1f2a] font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                Usuario
              </label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                type="text"
                required
                placeholder="Ingresa tu usuario"
                className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66]"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#1F8848] py-3.5 text-sm font-bold text-white shadow-md shadow-[#1F8848]/20 transition-all hover:bg-[#40A360] active:scale-95"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#245433]/70">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-bold text-[#1F8848] hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};