// ─── DatosPersonalesCard: Mi Perfil (nombre, email, estado) ──────────────────
import type { ICliente } from "../IClientes";

interface Props {
  perfil: ICliente;
}

export function DatosPersonalesCard({ perfil }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#245433]/10 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#245433]/10">
        <svg className="w-5 h-5 text-[#47aa66]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="text-sm font-black text-[#245433]">Mi Perfil</h3>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">
        {/* Nombre + Email en 2 cols */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">
              Nombre Completo
            </label>
            <div className="text-sm font-semibold text-[#1a2e22] bg-[#fdfbd7] border border-[#245433]/15 rounded-xl px-3.5 py-2.5">
              {perfil.full_name}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">
              Correo Electrónico
            </label>
            <div className="text-sm font-semibold text-[#1a2e22] bg-[#fdfbd7] border border-[#245433]/15 rounded-xl px-3.5 py-2.5 truncate">
              {perfil.email}
            </div>
          </div>
        </div>

        {/* Celular */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">
            Celular
          </label>
          <div className="text-sm font-semibold text-[#1a2e22] bg-[#fdfbd7] border border-[#245433]/15 rounded-xl px-3.5 py-2.5">
            {perfil.celular ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#47aa66]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4" />
                </svg>
                {perfil.celular}
              </span>
            ) : (
              <span className="text-[#245433]/40 italic">No cargado</span>
            )}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1.5">
            Usuario
          </label>
          <div className="text-sm font-mono font-semibold text-[#1a2e22] bg-[#fdfbd7] border border-[#245433]/15 rounded-xl px-3.5 py-2.5">
            @{perfil.username}
          </div>
        </div>
      </div>
    </div>
  );
}
