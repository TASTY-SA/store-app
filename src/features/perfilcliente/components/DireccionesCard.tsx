// ─── DireccionesCard: Listado, crear, editar, establecer principal ──────────
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDirecciones, crearDireccion, actualizarDireccion, eliminarDireccion, setDireccionPrincipal } from "../services/perfilService";
import type { DireccionCreate, DireccionUpdate, DireccionPublic } from "../IClientes";

// ── Tipos locales ────────────────────────────────────────────────────────────
interface FormState {
  alias: string;
  linea1: string;
  linea2: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  es_principal: boolean;
}

const EMPTY_FORM: FormState = {
  alias: "",
  linea1: "",
  linea2: "",
  ciudad: "",
  provincia: "",
  codigo_postal: "",
  es_principal: false,
};

function formToCreate(f: FormState): DireccionCreate {
  return {
    alias: f.alias || undefined,
    linea1: f.linea1,
    linea2: f.linea2 || undefined,
    ciudad: f.ciudad,
    provincia: f.provincia || undefined,
    codigo_postal: f.codigo_postal || undefined,
    es_principal: f.es_principal,
  };
}

function formToUpdate(f: FormState): DireccionUpdate {
  return {
    alias: f.alias || undefined,
    linea1: f.linea1 || undefined,
    linea2: f.linea2 || undefined,
    ciudad: f.ciudad || undefined,
    provincia: f.provincia || undefined,
    codigo_postal: f.codigo_postal || undefined,
    es_principal: f.es_principal,
  };
}

function direccionToForm(d: DireccionPublic): FormState {
  return {
    alias: d.alias ?? "",
    linea1: d.linea1,
    linea2: d.linea2 ?? "",
    ciudad: d.ciudad,
    provincia: d.provincia ?? "",
    codigo_postal: d.codigo_postal ?? "",
    es_principal: d.es_principal,
  };
}

// ── Modal genérico para crear / editar ────────────────────────────────────────
const inputClass =
  "w-full text-sm text-[#1a2e22] bg-[#fafafa] border border-[#245433]/20 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#47aa66]/40 focus:border-[#47aa66] transition-all placeholder:text-[#245433]/30";

interface DireccionFormModalProps {
  title: string;
  initial: FormState;
  onClose: () => void;
  onSave: (f: FormState) => void;
  saving: boolean;
}

function DireccionFormModal({ title, initial, onClose, onSave, saving }: DireccionFormModalProps) {
  const [form, setForm] = useState<FormState>(initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "es_principal" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#245433]/10 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#245433]/10">
          <h4 className="font-black text-[#245433] text-base">{title}</h4>
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
              <input className={inputClass} placeholder="Casa, Oficina…" value={form.alias} onChange={set("alias")} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Código Postal</label>
              <input className={inputClass} placeholder="C1010" value={form.codigo_postal} onChange={set("codigo_postal")} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Dirección *</label>
            <input className={inputClass} placeholder="Calle y número" required value={form.linea1} onChange={set("linea1")} />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Línea 2 (opcional)</label>
            <input className={inputClass} placeholder="Piso, depto…" value={form.linea2} onChange={set("linea2")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Ciudad *</label>
              <input className={inputClass} placeholder="Buenos Aires" required value={form.ciudad} onChange={set("ciudad")} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#245433]/50 mb-1">Provincia</label>
              <input className={inputClass} placeholder="CABA" value={form.provincia} onChange={set("provincia")} />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.es_principal}
              onChange={set("es_principal")}
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

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: direcciones = [], isLoading } = useQuery({
    queryKey: ["direcciones"],
    queryFn: getDirecciones,
    staleTime: 1000 * 60,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────
  const { mutate: crear, isPending: savingCreate } = useMutation({
    mutationFn: (f: FormState) => crearDireccion(formToCreate(f)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["direcciones"] });
      setShowCreate(false);
    },
  });

  const { mutate: editar, isPending: savingEdit } = useMutation({
    mutationFn: ({ id, f }: { id: number; f: FormState }) => actualizarDireccion(id, formToUpdate(f)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["direcciones"] });
      setEditandoId(null);
    },
  });

  const { mutate: eliminar } = useMutation({
    mutationFn: eliminarDireccion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["direcciones"] }),
  });

  const { mutate: setPrincipal } = useMutation({
    mutationFn: setDireccionPrincipal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["direcciones"] }),
  });

  const direccionEditando = editandoId !== null
    ? direcciones.find((d) => d.id === editandoId) ?? null
    : null;

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
            onClick={() => setShowCreate(true)}
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
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-[#f0f0f0] animate-pulse" />
              ))}
            </div>
          ) : direcciones.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <svg className="w-10 h-10 text-[#245433]/20 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-sm font-semibold text-[#245433]/50">Sin direcciones guardadas</p>
              <button onClick={() => setShowCreate(true)} className="mt-2 text-xs font-bold text-[#1F8848] hover:underline">
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
                  <p className="text-xs text-[#245433]/55">
                    {dir.ciudad}
                    {dir.provincia ? `, ${dir.provincia}` : ""}
                    {dir.codigo_postal ? ` ${dir.codigo_postal}` : ""}
                  </p>
                </div>

                {/* Acciones: solo visibles en hover */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                  {/* Botón editar */}
                  <button
                    onClick={() => setEditandoId(dir.id)}
                    className="p-1.5 rounded-full text-[#245433]/40 hover:text-[#1F8848] hover:bg-[#e8f5ee] transition-colors"
                    title="Editar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {/* Botón establecer como principal (solo si no es principal ya) */}
                  {!dir.es_principal && (
                    <button
                      onClick={() => setPrincipal(dir.id)}
                      className="p-1.5 rounded-full text-[#245433]/40 hover:text-[#e67e22] hover:bg-[#fef5e7] transition-colors"
                      title="Establecer como principal"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  )}
                  {/* Botón eliminar */}
                  <button
                    onClick={() => eliminar(dir.id)}
                    className="p-1.5 rounded-full text-[#245433]/40 hover:text-[#7b1f2a] hover:bg-[#fdecea] transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal crear */}
      {showCreate && (
        <DireccionFormModal
          title="Nueva Dirección"
          initial={EMPTY_FORM}
          onClose={() => setShowCreate(false)}
          onSave={(f) => crear(f)}
          saving={savingCreate}
        />
      )}

      {/* Modal editar */}
      {editandoId !== null && direccionEditando && (
        <DireccionFormModal
          title="Editar Dirección"
          initial={direccionToForm(direccionEditando)}
          onClose={() => setEditandoId(null)}
          onSave={(f) => editar({ id: editandoId, f })}
          saving={savingEdit}
        />
      )}
    </>
  );
}
