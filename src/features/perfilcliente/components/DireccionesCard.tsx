// ─── DireccionesCard: Listado de direcciones + añadir nueva ─────────────────
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDirecciones, crearDireccion, eliminarDireccion } from "../services/perfilService";
import type { DireccionCreate } from "../IClientes";

// ── Formulario de nueva dirección ─────────────────────────────────────────────
interface FormState {
  alias: string;
  linea1: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  es_principal: boolean;
}

const EMPTY_FORM: FormState = {
  alias: "",
  linea1: "",
  ciudad: "",
  provincia: "",
  codigo_postal: "",
  es_principal: false,
};

function NuevaDireccionModal({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (d: DireccionCreate) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      alias: form.alias || undefined,
      linea1: form.linea1,
      ciudad: form.ciudad,
      provincia: form.provincia || undefined,
      codigo_postal: form.codigo_postal || undefined,
      es_principal: form.es_principal,
    });
  };

  const input =
    "w-full text-sm text-[#1a2e22] bg-[#fafafa] border border-[#245433]/20 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#47aa66]/40 focus:border-[#47aa66] transition-all placeholder:text-[#245433]/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#245433]/10 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#245433]/10">
          <h4 className="font-black text-[#245433] text-base">Nueva Dirección</h4>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#245433]/8 transition-colors">
            <svg className="w-5 h-5 text-[#245433]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Alias (ej: Casa)</label>
              <input className={input} placeholder="Casa, Oficina…" value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Código Postal</label>
              <input className={input} placeholder="C1010" value={form.codigo_postal} onChange={e => setForm(f => ({ ...f, codigo_postal: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Dirección *</label>
            <input className={input} placeholder="Calle y número" required value={form.linea1} onChange={e => setForm(f => ({ ...f, linea1: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Ciudad *</label>
              <input className={input} placeholder="Buenos Aires" required value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Provincia</label>
              <input className={input} placeholder="CABA" value={form.provincia} onChange={e => setForm(f => ({ ...f, provincia: e.target.value }))} />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.es_principal}
              onChange={e => setForm(f => ({ ...f, es_principal: e.target.checked }))}
              className="w-4 h-4 accent-[#1F8848] rounded"
            />
            <span className="text-sm font-semibold text-[#245433]">Establecer como principal</span>
          </label>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-bold text-[#245433]/70 border border-[#245433]/20 rounded-xl py-2.5 hover:bg-[#245433]/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 text-sm font-bold text-white bg-[#1F8848] rounded-xl py-2.5 hover:bg-[#40A360] transition-colors shadow-md shadow-[#1F8848]/25 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function DireccionesCard() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: direcciones = [], isLoading } = useQuery({
    queryKey: ["direcciones"],
    queryFn: getDirecciones,
    staleTime: 1000 * 60,
  });

  const { mutate: crear, isPending: saving } = useMutation({
    mutationFn: crearDireccion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["direcciones"] });
      setShowForm(false);
    },
  });

  const { mutate: eliminar } = useMutation({
    mutationFn: eliminarDireccion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["direcciones"] }),
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#245433]/10 shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#245433]/10">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-[#47aa66]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <h3 className="text-sm font-black text-[#245433]">Direcciones</h3>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1F8848] text-white shadow-md shadow-[#1F8848]/25 hover:bg-[#40A360] transition-colors"
            title="Agregar dirección"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-16 rounded-xl bg-[#f0f0f0] animate-pulse" />)}
            </div>
          ) : direcciones.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <svg className="w-10 h-10 text-[#245433]/20 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-sm font-semibold text-[#245433]/50">Sin direcciones guardadas</p>
              <button onClick={() => setShowForm(true)} className="mt-2 text-xs font-bold text-[#1F8848] hover:underline">
                Agregar una dirección
              </button>
            </div>
          ) : (
            direcciones.map((dir) => (
              <div
                key={dir.id}
                className={`relative group border rounded-xl px-4 py-3 transition-all duration-200 ${
                  dir.es_principal
                    ? "border-[#47aa66]/50 bg-[#f0faf4]"
                    : "border-[#245433]/10 bg-[#fafafa] hover:border-[#245433]/25"
                }`}
              >
                {dir.es_principal && (
                  <span className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-widest text-white bg-[#1F8848] px-2 py-0.5 rounded-full">
                    {dir.alias || "PRINCIPAL"}
                  </span>
                )}
                {!dir.es_principal && dir.alias && (
                  <span className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-widest text-[#245433] bg-[#e8f5ee] border border-[#245433]/20 px-2 py-0.5 rounded-full">
                    {dir.alias}
                  </span>
                )}
                <div className={`${dir.alias ? "mt-4" : ""}`}>
                  <p className="text-sm font-bold text-[#245433]">{dir.linea1}</p>
                  <p className="text-xs text-[#245433]/55">{dir.ciudad}{dir.provincia ? `, ${dir.provincia}` : ""}{dir.codigo_postal ? ` ${dir.codigo_postal}` : ""}</p>
                </div>
                {/* Botón eliminar */}
                <button
                  onClick={() => eliminar(dir.id)}
                  className="absolute top-3 right-3 p-1 rounded-full text-[#245433]/30 hover:text-[#7b1f2a] hover:bg-[#fdecea] transition-all duration-150 opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <NuevaDireccionModal
          onClose={() => setShowForm(false)}
          onSave={(d) => crear(d)}
          saving={saving}
        />
      )}
    </>
  );
}
