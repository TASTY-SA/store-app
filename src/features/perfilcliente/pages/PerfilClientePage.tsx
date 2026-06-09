import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { usePerfilCliente } from "../hooks/usePerfilCliente";
import { NavBar } from "../../../shared/NavBar/NavBar";
import { HeroCard } from "../components/HeroCard";
import { DatosPersonalesCard } from "../components/DatosPersonalesCard";
import { DireccionesCard } from "../components/DireccionesCard";
import { PreferenciasCard } from "../components/PreferenciasCard";
import { MetodosPagoCard } from "../components/MetodosPagoCard";

export function PerfilClientePage() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  const {
    perfil,
    fotoPerfil,
    isLoading,
    error,
    handleFotoChange,
    handleFotoRemove,
  } = usePerfilCliente();

  // ─── Estado de carga y autenticación ──────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 w-full max-w-[860px] mx-auto px-5 pt-10 pb-20">
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#fdfbd7]/60 border-1.5 border-dashed border-[#c5c89a] rounded-[24px] gap-3">
            <div className="text-5xl mb-2">🔒</div>
            <h2 className="m-0 text-xl font-extrabold text-[#245433]">Inicia sesión para ver tu perfil</h2>
            <p className="m-0 text-sm text-[#245433]/60 max-w-[320px] leading-relaxed">
              Necesitás estar autenticado para acceder a tu perfil y direcciones.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-[#1F8848] text-white rounded-2xl px-6 py-3 text-sm font-bold no-underline transition-all duration-200 shadow-lg shadow-[#1F8848]/25 hover:bg-[#40A360] active:scale-95"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-[#245433]/60 text-sm font-semibold">
          <div className="w-9 h-9 border-[3px] border-[#c8e6c9] border-t-[#1F8848] rounded-full animate-spin" />
          <p>Cargando tu perfil...</p>
        </main>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 w-full max-w-[860px] mx-auto px-5 pt-10 pb-20">
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#fdfbd7]/60 border-1.5 border-dashed border-[#c5c89a] rounded-[24px] gap-3">
            <div className="text-5xl mb-2">⚠️</div>
            <h2 className="m-0 text-xl font-extrabold text-[#245433]">Ups, algo salió mal</h2>
            <p className="m-0 text-sm text-[#245433]/60 max-w-[320px] leading-relaxed">
              {error || "No se pudo cargar la información del perfil."}
            </p>
            <button
              className="inline-flex items-center gap-2 bg-[#1F8848] text-white rounded-2xl px-6 py-3 text-sm font-bold no-underline transition-all duration-200 shadow-lg shadow-[#1F8848]/25 hover:bg-[#40A360] active:scale-95"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
      <NavBar />

      <main className="flex-1 w-full max-w-[860px] mx-auto px-5 pt-8 pb-20 flex flex-col gap-6">
        {/* Header de la página */}
        <div className="flex flex-col items-start gap-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#245433]/70 hover:text-[#245433] transition-colors"
            aria-label="Volver"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-[#245433] tracking-tight">Mi Perfil</h1>
        </div>

        {/* Hero Card (Foto de perfil, nombre, roles) */}
        <HeroCard
          perfil={perfil}
          fotoPerfil={fotoPerfil}
          onFotoChange={handleFotoChange}
          onFotoRemove={handleFotoRemove}
        />

        {/* Grid de Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <DatosPersonalesCard perfil={perfil} />
            <MetodosPagoCard />
          </div>
          <div className="flex flex-col gap-6">
            <DireccionesCard />
            <PreferenciasCard />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-2">
          <button
            onClick={() => navigate("/perfil/editar")}
            className="flex items-center justify-center gap-2 bg-[#245433] text-[#fdfbd7] px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#1f492c] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Perfil
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-transparent text-[#7b1f2a] border border-[#7b1f2a]/30 hover:bg-[#7b1f2a]/5 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}

