import { useState } from "react";
import type { ICarritoItem } from "../ICarrito";

interface EditItemModalProps {
  item: ICarritoItem;
  onClose: () => void;
  onSave: (notas: string) => void;
}

export function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [notas, setNotas] = useState(item.notas || "");

  const handleSave = () => {
    onSave(notas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md overflow-hidden rounded-3xl bg-[#fdfbd7] border border-[#e8e5c0] p-6 shadow-2xl transition-all duration-300 scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#245433]/10 pb-4">
          <h3 className="text-xl font-bold text-[#245433]">Personalizar Pedido</h3>
          <button 
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#245433]/50 hover:bg-[#245433]/5 hover:text-[#245433]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-4">
            <img 
              src={item.producto.imagen_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"} 
              alt={item.producto.nombre} 
              className="h-16 w-16 rounded-xl object-cover border border-[#e8e5c0]"
            />
            <div>
              <h4 className="font-bold text-[#245433]">{item.producto.nombre}</h4>
              <p className="text-xs text-[#245433]/60 line-clamp-2 mt-0.5">{item.producto.descripcion}</p>
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245433]/70 mb-2">
              Notas e Ingredientes (ej. Sin Cebolla, Salsa extra)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Escribe tus requerimientos para el plato..."
              className="w-full rounded-2xl border border-[#c5c89a] bg-white p-3 text-sm text-[#245433] placeholder-[#245433]/45 focus:border-[#47aa66] focus:outline-none focus:ring-1 focus:ring-[#47aa66] min-h-[100px] resize-none"
              maxLength={200}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#245433]/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-[#245433] hover:bg-[#245433]/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-[#1F8848] px-5 py-2 text-sm font-bold text-white shadow-md shadow-[#1F8848]/20 hover:bg-[#40A360] active:scale-95 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
