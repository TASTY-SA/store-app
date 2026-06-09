// ─── MetodosPagoCard: Métodos de pago del cliente ─────────────────────────────
// Por ahora los datos son estáticos (decorativos) hasta que el backend los soporte

interface MetodoPago {
  id: string;
  tipo: "tarjeta" | "wallet";
  nombre: string;
  detalle: string;
  activo?: boolean;
  recargable?: boolean;
  balance?: string;
}

const METODOS_MOCK: MetodoPago[] = [
  {
    id: "visa-4242",
    tipo: "tarjeta",
    nombre: "Visa ending in 4242",
    detalle: "Expires 12/26",
    activo: true,
  },
  {
    id: "wallet",
    tipo: "wallet",
    nombre: "BigPickle Wallet",
    detalle: "Balance: $12,50",
    recargable: true,
    balance: "$12,50",
  },
];

function IconCard() {
  return (
    <svg className="w-5 h-5 text-[#245433]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M2 10h20" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg className="w-5 h-5 text-[#245433]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h3.75m-3.75 6h.008v.008H15V12zm-6 6a3 3 0 110-6h3.75m-3.75 6h.008v.008H9V18z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-[#1F8848]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.5 2.5 4.5-4.5" />
    </svg>
  );
}

export function MetodosPagoCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#245433]/10 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#245433]/10">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#47aa66]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <h3 className="text-sm font-black text-[#245433]">Métodos de Pago</h3>
        </div>
        {/* Icono decorativo de tarjeta */}
        <svg className="w-4 h-4 text-[#245433]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path strokeLinecap="round" d="M2 10h20" />
        </svg>
      </div>

      {/* Lista de métodos */}
      <div className="p-5 flex flex-col gap-3">
        {METODOS_MOCK.map((metodo) => (
          <div
            key={metodo.id}
            className="flex items-center gap-3 bg-[#fafafa] border border-[#245433]/10 rounded-xl px-4 py-3 hover:border-[#47aa66]/40 transition-colors"
          >
            {/* Icono */}
            <div className="shrink-0">
              {metodo.tipo === "tarjeta" ? <IconCard /> : <IconWallet />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#245433] truncate">{metodo.nombre}</p>
              <p className="text-[11px] text-[#245433]/50">{metodo.detalle}</p>
            </div>

            {/* Acción */}
            {metodo.activo && <IconCheck />}
            {metodo.recargable && (
              <button className="text-[11px] font-bold text-[#1F8848] hover:text-[#47aa66] transition-colors shrink-0">
                Recargar
              </button>
            )}
          </div>
        ))}

        {/* Agregar método (decorativo) */}
        <button className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-[#245433]/50 border border-dashed border-[#245433]/25 rounded-xl py-2.5 hover:border-[#47aa66]/60 hover:text-[#1F8848] transition-all duration-200 mt-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar método
        </button>
      </div>
    </div>
  );
}
