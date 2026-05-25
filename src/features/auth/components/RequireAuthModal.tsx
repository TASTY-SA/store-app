import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

interface RequireAuthModalProps {
  onClose: () => void;
}

export function RequireAuthModal({ onClose }: RequireAuthModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] p-6 shadow-2xl transition-all duration-300 scale-95 hover:scale-100 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono de advertencia o candado */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7b1f2a]/10 text-[#7b1f2a] border border-[#7b1f2a]/20 mb-4 ">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className="text-xl font-black text-[#245433]">¿Listo para ordenar?</h3>
        <p className="mt-2 text-sm text-[#245433]/70 leading-relaxed">
          Para agregar este producto al carrito y realizar tu pedido, necesitas iniciar sesión o registrarte.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/register"
            className="w-full rounded-2xl bg-[#1F8848] py-3 text-sm font-bold text-white shadow-md shadow-[#1F8848]/20 hover:bg-[#40A360] active:scale-95 transition-all block text-center"
          >
            Crear Cuenta / Registrarse
          </Link>
          <Link
            to="/login"
            className="w-full rounded-2xl border border-[#c5c89a] bg-white py-3 text-sm font-bold text-[#245433] hover:bg-[#245433]/5 active:scale-95 transition-all block text-center"
          >
            Iniciar Sesión
          </Link>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs font-bold text-[#245433]/50 hover:text-[#245433] transition-colors focus:outline-none"
        >
          Seguir explorando
        </button>
      </div>
    </div>,
    document.body
  );
}

