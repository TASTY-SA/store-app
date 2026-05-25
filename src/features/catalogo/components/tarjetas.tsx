import { useState } from "react";
import { useProductos } from "../hooks/hooksproductos";
import { useCartStore } from "../../../store/cartStore";

export const TarjetasPromos = () => {
  const { productos, isLoading } = useProductos();
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  // 1. Si está cargando o no hay datos todavía, no dejes que intente renderizar el componente principal
  if (isLoading || !productos?.data || productos.data.length === 0) {
    return <div className="p-10 text-center text-zinc-500">Cargando promo...</div>;
  }

  // 2. Ahora que sabemos con seguridad que 'productos.data' tiene al menos 1 elemento:
  const productoPromo = productos.data[0];

  const handleBuy = () => {
    addToCart(productoPromo, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex bg-[#F8E1A5] text-[#000000] h-128 w-300 my-10 mx-auto rounded-2xl overflow-hidden shadow-lg">
      <img 
        className="w-2/5 h-full object-cover"
        src={productoPromo.imagen_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"}
        alt={productoPromo.nombre}
      />

      {/* 3. COLUMNA DERECHA (Información): 'justify-between' para separar texto (arriba) de precio/botón (abajo) */}
      <div className="w-full p-8 flex flex-col justify-between">
        
        {/* Bloque Superior: Textos */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#241A00] font-bold">PROMO DEL DIA</span>
          <h2 className="text-3xl font-black tracking-tight">{productoPromo.nombre}</h2>
          <p className="text-sm text-[#241A00]/80 leading-relaxed">
            {productoPromo.descripcion || "Sin descripción disponible."}
          </p>
        </div>

        {/* Bloque Inferior: Precio + Botón alineados en fila horizontal */}
        <div className="flex items-center justify-between w-full border-t border-[#fdfbd7]/10 pt-6">
          <div className="flex flex-col">
            <span className="text-sm text-[#241A00]/60 uppercase">Precio</span>
            <span className="text-3xl font-black text-[#1F8848] mx-4">${productoPromo.precio_base}</span>
          </div>
          
          <button 
            onClick={handleBuy}
            disabled={added}
            className={`text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg duration-300 ${
              added 
                ? "bg-emerald-600 shadow-emerald-600/20 cursor-default scale-100" 
                : "bg-[#1F8848] hover:bg-[#40A360] shadow-[#ff4e8d]/20"
            }`}
          >
            {added ? "¡AGREGADO!" : "COMPRAR"}
          </button>
        </div>

      </div>
    </div>
  );
};
