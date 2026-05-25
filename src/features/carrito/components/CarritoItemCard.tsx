import { useState } from "react";
import type { ICarritoItem } from "../ICarrito";
import { EditItemModal } from "./EditItemModal";

interface CarritoItemCardProps {
  item: ICarritoItem;
  onUpdateQuantity: (id: number, qty: number) => void;
  onUpdateNotes: (id: number, notes: string) => void;
  onRemove: (id: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export function CarritoItemCard({
  item,
  onUpdateQuantity,
  onUpdateNotes,
  onRemove,
}: CarritoItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { producto, cantidad, notas } = item;

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-[#e8e5c0] bg-[#fdfbd7]/50 p-4 transition-all hover:shadow-md sm:flex-row sm:items-center">
      {/* Botón eliminar (X) */}
      <button
        onClick={() => onRemove(producto.id)}
        className="absolute top-3 right-3 text-[#245433]/40 transition-colors hover:text-red-600 focus:outline-none"
        aria-label="Eliminar producto"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Imagen */}
      <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl border border-[#e8e5c0] sm:h-24 sm:w-24">
        <img
          src={producto.imagen_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"}
          alt={producto.nombre}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between pr-6">
        <div>
          <h3 className="font-bold text-[#245433] text-base leading-tight">
            {producto.nombre}
          </h3>
          <p className="mt-1 text-xs text-[#245433]/65 line-clamp-2 leading-relaxed">
            {producto.descripcion}
          </p>
        </div>

        {/* Modificaciones/Notas */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {notas ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#47aa66]/30 bg-[#47aa66]/10 px-2.5 py-0.5 text-xs font-medium text-[#245433]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#47aa66]" />
              {notas}
            </span>
          ) : null}

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#1F8848] transition-colors hover:text-[#40A360] focus:outline-none"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Editar
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          {/* Precio */}
          <span className="text-base font-black text-[#1F8848]">
            {fmt(producto.precio_base * cantidad)}
          </span>

          {/* Controles de cantidad */}
          <div className="flex items-center rounded-xl border border-[#c5c89a] bg-white px-2 py-1 shadow-sm">
            <button
              onClick={() => onUpdateQuantity(producto.id, cantidad - 1)}
              className="flex h-6 w-6 items-center justify-center text-[#245433] hover:text-red-600 disabled:opacity-40"
              disabled={cantidad <= 1}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#245433]">
              {cantidad}
            </span>
            <button
              onClick={() => onUpdateQuantity(producto.id, cantidad + 1)}
              className="flex h-6 w-6 items-center justify-center text-[#245433] hover:text-[#1F8848]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditItemModal
          item={item}
          onClose={() => setIsEditing(false)}
          onSave={(newNotes) => onUpdateNotes(producto.id, newNotes)}
        />
      )}
    </div>
  );
}
