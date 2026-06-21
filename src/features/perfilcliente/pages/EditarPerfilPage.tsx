// ─── EditarPerfilPage: Formulario de edición de perfil ──────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/authStore";
import { useToastStore } from "../../../store/toastStore";
import { getPerfilCliente, actualizarPerfil } from "../services/perfilService";
import { NavBar } from "../../../shared/NavBar/NavBar";
import { Skeleton, SkeletonPerfilForm } from "../../../shared/components/Skeleton";

function parseFullName(full_name: string) {
  const parts = full_name.trim().split(/\s+/);
  const nombre = parts[0] || "";
  const apellido = parts.slice(1).join(" ") || "";
  return { nombre, apellido };
}

export function EditarPerfilPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // ─── Cargar perfil actual ────────────────────────────────────────────────
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ["perfil"],
    queryFn: getPerfilCliente,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  // ─── Estado del formulario ────────────────────────────────────────────────
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");

  useEffect(() => {
    if (perfil) {
      const { nombre: n, apellido: a } = parseFullName(perfil.full_name);
      setNombre(n);
      setApellido(a);
      setEmail(perfil.email);
      setCelular(perfil.celular ?? "");
    }
  }, [perfil]);

  // ─── Estado de éxito ───────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  // ─── Validación de celular ─────────────────────────────────────────────
  const [celularError, setCelularError] = useState<string | null>(null);

  const validarCelular = (tel: string): string | null => {
    if (!tel.trim()) return null; // opcional en edición
    const soloDigitos = tel.replace(/\D/g, "");
    if (soloDigitos.length < 7) return "Debe tener al menos 7 dígitos";
    if (soloDigitos.length > 15) return "El número es demasiado largo";
    if (!/^[\d\s\+\-\(\)]+$/.test(tel.trim())) return "Formato inválido";
    return null;
  };

  const handleCelularChange = (value: string) => {
    setCelular(value);
    setCelularError(validarCelular(value));
  };

  // ─── Mutación ─────────────────────────────────────────────────────────────
  const { mutate: guardar, isPending: guardando } = useMutation({
    mutationFn: () =>
      actualizarPerfil(perfil!.id, {
        full_name: `${nombre} ${apellido}`.trim(),
        email,
        celular: celular || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["perfil"] });
      addToast("Perfil actualizado correctamente", "success");
      setShowSuccess(true);
    },
    onError: () => {
      addToast("Error al guardar el perfil. Intentá de nuevo.", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    const err = validarCelular(celular);
    if (err) {
      setCelularError(err);
      return;
    }

    guardar();
  };

  const inputClass =
    "w-full text-sm text-[#1a2e22] bg-[#fafafa] border border-[#245433]/20 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#47aa66]/40 focus:border-[#47aa66] transition-all placeholder:text-[#245433]/30";

  // ─── No autenticado ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
          <h1 className="text-2xl font-black">Acceso denegado</h1>
          <p className="text-sm text-[#245433]/70">Iniciá sesión para editar tu perfil.</p>
          <button onClick={() => navigate("/login")} className="bg-[#1F8848] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#40A360] transition-colors">
            Iniciar Sesión
          </button>
        </main>
      </div>
    );
  }

  if (loadingPerfil) {
    return (
      <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
        <NavBar />
        <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 pb-20">
          <Skeleton className="h-5 w-28 mb-4" />
          <Skeleton className="h-9 sm:h-10 w-48 mb-6" />
          <SkeletonPerfilForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6d8] flex flex-col text-[#245433]">
      <NavBar />

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 pb-20">
        {/* Volver */}
        <button
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#245433]/70 hover:text-[#245433] transition-colors mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al perfil
        </button>

        <h1 className="text-3xl sm:text-4xl font-black text-[#245433] tracking-tight mb-6">Editar Perfil</h1>

        {showSuccess ? (
          <div className="bg-white rounded-2xl border border-[#47aa66]/30 shadow-md p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e8f5ee] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1F8848]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#245433]">¡Cambios guardados!</h2>
              <p className="text-sm text-[#245433]/60 mt-1">Tu perfil se actualizó correctamente.</p>
            </div>
            <button
              onClick={() => navigate("/perfil")}
              className="bg-[#1F8848] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#40A360] transition-colors shadow-md shadow-[#1F8848]/25"
            >
              Volver al perfil
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#245433]/10 shadow-md p-6 flex flex-col gap-4">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">Nombre *</label>
              <input
                className={inputClass}
                placeholder="Juan"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">Apellido</label>
              <input
                className={inputClass}
                placeholder="Pérez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">Correo Electrónico *</label>
            <input
              className={inputClass}
              type="email"
              placeholder="juan@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Celular */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">Celular</label>
            <input
              className={`${inputClass} ${celularError ? "border-[#7b1f2a]/50 focus:ring-[#7b1f2a]/40 focus:border-[#7b1f2a]" : ""}`}
              type="tel"
              placeholder="+54 11 1234-5678"
              value={celular}
              onChange={(e) => handleCelularChange(e.target.value)}
            />
            {celularError ? (
              <p className="text-[10px] text-[#7b1f2a] mt-1 font-medium">{celularError}</p>
            ) : (
              <p className="text-[10px] text-[#245433]/40 mt-1">Campo nuevo en v7 — opcional</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate("/perfil")}
              className="flex-1 text-sm font-bold text-[#245433]/70 border border-[#245433]/20 rounded-xl py-2.5 hover:bg-[#245433]/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !!celularError}
              className="flex-1 text-sm font-bold text-white bg-[#1F8848] rounded-xl py-2.5 hover:bg-[#40A360] transition-colors shadow-md shadow-[#1F8848]/25 disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar Cambios"}
            </button>
          </div>
        </form>
        )}
      </main>
    </div>
  );
}
