// ─── PreferenciasCard: Notificaciones, Idioma, Modo Gourmet ──────────────────
import { useState } from "react";

interface Preferencias {
  notificaciones: boolean;
  idioma: string;
  modoGourmet: boolean;
}

const PREF_STORAGE_KEY = "perfil_preferencias";

function loadPrefs(): Preferencias {
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { notificaciones: true, idioma: "es", modoGourmet: false };
}

function savePrefs(p: Preferencias) {
  localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(p));
}

// Toggle switch reutilizable
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[22px] w-[40px] shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#1F8848]" : "bg-[#245433]/20"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-md transform transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Icono de traducción
function IconTranslate() {
  return (
    <svg className="w-5 h-5 text-[#245433]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

// Icono de campana
function IconBell() {
  return (
    <svg className="w-4 h-4 text-[#1F8848]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

export function PreferenciasCard() {
  const [prefs, setPrefs] = useState<Preferencias>(loadPrefs);

  const update = (patch: Partial<Preferencias>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#245433]/10 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#245433]/10">
        <svg className="w-5 h-5 text-[#47aa66]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <h3 className="text-sm font-black text-[#245433]">Preferencias</h3>
      </div>

      {/* Items */}
      <div className="p-5 flex flex-col divide-y divide-[#245433]/8">
        {/* Notificaciones */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <IconBell />
            <div>
              <p className="text-sm font-bold text-[#245433]">Notificaciones</p>
              <p className="text-[11px] text-[#245433]/50">Ofertas y pedidos</p>
            </div>
          </div>
          <Toggle checked={prefs.notificaciones} onChange={(v) => update({ notificaciones: v })} />
        </div>

        {/* Idioma */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <IconTranslate />
            <div>
              <p className="text-sm font-bold text-[#245433]">Idioma</p>
              <p className="text-[11px] text-[#245433]/50">
                {prefs.idioma === "es" ? "Español (ES)" : prefs.idioma === "en" ? "English (EN)" : "Português (PT)"}
              </p>
            </div>
          </div>
          {/* Selector de idioma decorativo */}
          <select
            value={prefs.idioma}
            onChange={(e) => update({ idioma: e.target.value })}
            className="text-[11px] font-bold text-[#245433] bg-[#fdfbd7] border border-[#245433]/20 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#47aa66]/40"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="pt">PT</option>
          </select>
        </div>

        {/* Modo Gourmet */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#245433]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <p className="text-sm font-bold text-[#245433]">Modo Gourmet</p>
              <p className="text-[11px] text-[#245433]/50">Tips de cocina diarios</p>
            </div>
          </div>
          <Toggle checked={prefs.modoGourmet} onChange={(v) => update({ modoGourmet: v })} />
        </div>
      </div>
    </div>
  );
}
