// ─── HeroCard: Foto de perfil + nombre + badges de rol ────────────────────────
import { useRef } from "react";
import type { ICliente } from "../IClientes";

interface Props {
  perfil: ICliente;
  fotoPerfil: string | null;
  onFotoChange: (file: File) => void;
  onFotoRemove: () => void;
}

function DefaultAvatar() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="40" fill="#e8f5ee" />
      <circle cx="40" cy="30" r="14" fill="#47aa66" />
      <ellipse cx="40" cy="68" rx="22" ry="14" fill="#47aa66" />
    </svg>
  );
}

const ROL_BADGE: Record<string, string> = {
  CLIENT: "bg-[#e3f5eb] text-[#1a6636] border border-[#1a6636]/20",
  CLIENTE: "bg-[#e3f5eb] text-[#1a6636] border border-[#1a6636]/20",
  ADMIN: "bg-[#fde9ec] text-[#7b1f2a] border border-[#7b1f2a]/20",
  PEDIDOS: "bg-[#e8eaff] text-[#3741a8] border border-[#3741a8]/20",
};

export function HeroCard({ perfil, fotoPerfil, onFotoChange, onFotoRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iniciales = perfil.full_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFotoChange(file);
  };

  return (
    <div className="flex items-center gap-6 bg-white rounded-2xl border border-[#245433]/10 shadow-md p-6 animate-[fadeUp_0.4s_ease_both]">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div
          className="relative w-[100px] h-[100px] rounded-full border-[3px] border-[#47aa66] cursor-pointer overflow-hidden bg-[#e8f5ee] flex items-center justify-center shadow-lg shadow-[#47aa66]/25 hover:shadow-[#47aa66]/40 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : iniciales ? (
            <span className="text-3xl font-black text-[#1F8848] select-none">{iniciales}</span>
          ) : (
            <DefaultAvatar />
          )}
          {/* Overlay cámara */}
          <div className="absolute inset-0 bg-[#1F8848]/65 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
        </div>

        {/* Botones foto */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#1F8848] bg-[#e8f5ee] border border-[#47aa66]/30 rounded-full px-3 py-1 hover:bg-[#d0edda] transition-colors whitespace-nowrap"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          Cambiar foto
        </button>
        {fotoPerfil && (
          <button
            onClick={onFotoRemove}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#7b1f2a] bg-[#fdecea] border border-[#7b1f2a]/20 rounded-full px-3 py-1 hover:bg-[#f8d5d8] transition-colors whitespace-nowrap"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Quitar foto
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-black text-[#245433] tracking-tight leading-tight mb-1">{perfil.full_name}</h2>
        <p className="text-sm text-[#245433]/60 font-medium mb-3">@{perfil.username}</p>
        <p className="text-xs text-[#245433]/50 mb-3">{perfil.email}</p>
        <div className="flex flex-wrap gap-2">
          {perfil.roles.map((rol) => (
            <span
              key={rol.codigo}
              className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${ROL_BADGE[rol.codigo.toUpperCase()] ?? "bg-[#e8f5ee] text-[#245433] border border-[#245433]/20"}`}
            >
              {rol.nombre || rol.codigo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
