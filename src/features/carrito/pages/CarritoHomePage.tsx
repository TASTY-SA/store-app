import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { NavBar } from "../../../shared/NavBar/NavBar";
import { CarritoItemCard } from "../components/CarritoItemCard";
import { ResumenPedido } from "../components/ResumenPedido";
import { RequireAuthModal } from "../../auth/components/RequireAuthModal";
import { pedidoService } from "../../pedido";

export function CarritoHomePage() {
  const {
    items,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (items.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      await pedidoService.create({
        forma_pago_codigo: "EFECTIVO",
        notas: null,
        items: items.map((item) => ({
          producto_id: item.producto.id!,
          cantidad: item.cantidad,
        })),
      });
      clearCart();
      navigate("/pedidos");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join(", ")
          : "Ocurrió un error al procesar el pedido.";
      setCheckoutError(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6d8] text-[#245433] flex flex-col">
      {/* Navbar */}
      <NavBar />


      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#245433] tracking-tight">Tu Carrito</h1>
          <p className="mt-2 text-sm text-[#245433]/65">
            Revisa tus selecciones y prepárate para disfrutar.
          </p>
        </div>

        {items.length === 0 ? (
          /* Carrito Vacío */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#fdfbd7]/50 rounded-3xl border border-[#e8e5c0]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#245433]/5 text-[#245433]/40 mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#245433]">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-[#245433]/60 max-w-xs">
              Parece que aún no has agregado antojos a tu pedido.
            </p>
            <Link
              to="/catalogo"
              className="mt-6 rounded-2xl bg-[#1F8848] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#1F8848]/25 hover:bg-[#40A360] active:scale-95 transition-all"
            >
              Explorar el Menú
            </Link>
          </div>
        ) : (
          /* Contenido del Carrito (2 Columnas) */
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Listado de Artículos */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <CarritoItemCard
                  key={item.producto.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onUpdateNotes={updateNotes}
                  onRemove={removeFromCart}
                />
              ))}

              {/* Enlace para continuar explorando */}
              <Link
                to="/catalogo"
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c5c89a] bg-[#fdfbd7]/20 py-4 text-sm font-bold text-[#245433] hover:border-[#1F8848] hover:bg-[#fdfbd7]/50 hover:text-[#1F8848] transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                ¿Con más antojo? Explora el Menú
              </Link>
            </div>

            {/* Panel de Resumen de Compra */}
            <div className="w-full lg:w-[380px] shrink-0">
              <ResumenPedido
                subtotal={subtotal}
                totalItems={totalItems}
                onCheckout={handleCheckout}
                loading={checkoutLoading}
                error={checkoutError}
              />
            </div>
          </div>
        )}
      </main>
      {showAuthModal && (
        <RequireAuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}


