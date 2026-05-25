import { useState } from "react";

interface ResumenPedidoProps {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
  loading?: boolean;
  error?: string | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export function ResumenPedido({
  subtotal,
  totalItems,
  onCheckout,
  loading = false,
  error = null,
}: ResumenPedidoProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");

  // Tarifas de envío e impuestos simulados (fijos si hay elementos, 0 si está vacío)
  const deliveryFee = subtotal > 0 ? 500 : 0;
  const taxesAndFees = subtotal > 0 ? Math.round(subtotal * 0.08) : 0; // 8% de impuestos

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === "PAPUS10" || code === "DESCUENTO10") {
      setDiscountPercent(10);
      setPromoMessage("¡Código PAPUS10 aplicado! 10% de descuento.");
      setPromoStatus("success");
    } else if (code === "BIGPICKLE" || code === "FREE") {
      setDiscountPercent(15);
      setPromoMessage("¡Código BIGPICKLE aplicado! 15% de descuento.");
      setPromoStatus("success");
    } else {
      setDiscountPercent(0);
      setPromoMessage("Código promocional inválido.");
      setPromoStatus("error");
    }
  };

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount + deliveryFee + taxesAndFees;

  return (
    <div className="rounded-3xl border border-[#e8e5c0] bg-[#fdfbd7]/50 p-6 shadow-sm">
      <h3 className="text-xl font-extrabold text-[#245433] tracking-tight mb-4">
        Resumen del Pedido
      </h3>

      <hr className="border-[#e8e5c0] mb-4" />

      <div className="flex flex-col gap-3 text-sm text-[#245433]/85">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Descuento ({discountPercent}%)</span>
            <span>-{fmt(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Tarifa de Entrega</span>
          <span className="font-semibold">{subtotal > 0 ? fmt(deliveryFee) : fmt(0)}</span>
        </div>

        <div className="flex justify-between">
          <span>Impuestos y Tarifas</span>
          <span className="font-semibold">{subtotal > 0 ? fmt(taxesAndFees) : fmt(0)}</span>
        </div>
      </div>

      <div className="mt-5">
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <input
            type="text"
            placeholder="Código Promocional"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={subtotal === 0 || loading}
            className="flex-1 rounded-xl border border-[#c5c89a] bg-white px-3 py-2 text-xs text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] disabled:bg-[#f7f6d8]/50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={subtotal === 0 || loading}
            className="rounded-xl bg-[#1F8848] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#1F8848]/20 transition-all hover:bg-[#40A360] active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Aplicar
          </button>
        </form>

        {promoMessage && (
          <p className={`mt-2 text-xs font-semibold ${
            promoStatus === "success" ? "text-emerald-600" : "text-[#7b1f2a]"
          }`}>
            {promoMessage}
          </p>
        )}
      </div>

      <hr className="border-[#e8e5c0] my-5" />

      <div className="flex items-end justify-between mb-4">
        <span className="text-base font-bold text-[#245433]">Total</span>
        <span className="text-2xl font-black text-[#1F8848]">
          {fmt(total)}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={subtotal === 0 || loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1F8848] py-3.5 text-base font-bold text-white shadow-lg shadow-[#1F8848]/30 transition-all duration-200 hover:bg-[#40A360] hover:shadow-xl hover:shadow-[#1F8848]/40 active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Realizar Pedido</span>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#245433]/50">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Pago Seguro</span>
      </div>
    </div>
  );
}
