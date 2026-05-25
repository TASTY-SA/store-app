import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../auth/services/axiosInstance";
import type { IProducto } from "../../productos/IProducto";
import type { ICategoria } from "../../categoria/ICategoria";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { RequireAuthModal } from "../../auth/components/RequireAuthModal";

// ─── API calls ────────────────────────────────────────────────────────────────

const fetchCategorias = async (): Promise<ICategoria[]> => {
  const res = await apiClient.get<{ data: ICategoria[]; total: number }>(
    "/categorias/?offset=0&limit=100"
  );
  return res.data.data;
};

const fetchProductos = async (offset = 0, limit = 50): Promise<IProducto[]> => {
  const res = await apiClient.get<{ data: IProducto[]; total: number }>(
    `/productos/?offset=${offset}&limit=${limit}`
  );
  return res.data.data;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ producto }: { producto: IProducto }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [added, setAdded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAdd = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addToCart(producto, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#fffff0] border border-[#e8e5c0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={producto.imagen_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"}
          alt={producto.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400";
          }}
        />
        {/* category badge */}
        {producto.categorias && producto.categorias.length > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-[#1F8848]/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            {producto.categorias[0].nombre}
          </span>
        )}
        {/* stock badge */}
        {producto.stock_cantidad !== undefined && producto.stock_cantidad <= 5 && (
          <span className="absolute top-2 right-2 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white">
            ¡Últimas {producto.stock_cantidad}!
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#1a3a26] text-base leading-tight line-clamp-1">
            {producto.nombre}
          </h3>
          <span className="shrink-0 text-base font-black text-[#1F8848]">
            {fmt(producto.precio_base)}
          </span>
        </div>

        <p className="text-xs text-[#245433]/70 leading-relaxed line-clamp-2 flex-1">
          {producto.descripcion}
        </p>

        <button
          onClick={handleAdd}
          disabled={added}
          className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 active:scale-95 ${
            added
              ? "bg-emerald-600 shadow-emerald-600/30 cursor-default"
              : "bg-[#1F8848] shadow-[#1F8848]/30 hover:bg-[#40A360]"
          }`}
        >
          {added ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              ¡Agregado!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar al carrito
            </>
          )}
        </button>
      </div>

      {showAuthModal && (
        <RequireAuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>

  );
}


// ─── Main component ───────────────────────────────────────────────────────────

export const CatalogoTarjetas = () => {
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // Fetch categories
  const { data: categorias = [], isLoading: catLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch all products (up to 50)
  const { data: productos = [], isLoading: prodLoading } = useQuery({
    queryKey: ["productos-catalogo"],
    queryFn: () => fetchProductos(0, 50),
    staleTime: 1000 * 60 * 2,
  });

  // Derive parent / child categories from flat list
  const parentCats = categorias.filter((c) => !c.parent_id);
  const childCats = selectedParentId
    ? categorias.filter((c) => c.parent_id === selectedParentId)
    : categorias.filter((c) => !!c.parent_id);

  // Filter products
  const filteredProducts = productos.filter((p) => {
    const cats = p.categorias ?? [];
    if (selectedChildId) {
      return cats.some((c) => c.id === selectedChildId);
    }
    if (selectedParentId) {
      return cats.some(
        (c) => c.id === selectedParentId || c.parent_id === selectedParentId
      );
    }
    return true;
  });

  const handleParentSelect = (id: number) => {
    if (selectedParentId === id) {
      setSelectedParentId(null);
      setSelectedChildId(null);
    } else {
      setSelectedParentId(id);
      setSelectedChildId(null);
    }
  };

  const handleChildSelect = (id: number) => {
    setSelectedChildId(selectedChildId === id ? null : id);
  };

  const isLoading = catLoading || prodLoading;

  return (
    <section className="min-h-screen bg-[#f7f6d8] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#1a3a26] tracking-tight">Nuestro Menú</h2>
          <p className="mt-1 text-sm text-[#245433]/60">
            {filteredProducts.length} productos disponibles
          </p>
        </div>

        {/* Child category quick-filter tabs (top-right) */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedChildId(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
              selectedChildId === null
                ? "bg-[#1F8848] text-white shadow-md shadow-[#1F8848]/30"
                : "bg-white text-[#245433] border border-[#c5c89a] hover:border-[#1F8848] hover:text-[#1F8848]"
            }`}
          >
            Todos
          </button>
          {childCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleChildSelect(cat.id!)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                selectedChildId === cat.id
                  ? "bg-[#1F8848] text-white shadow-md shadow-[#1F8848]/30"
                  : "bg-white text-[#245433] border border-[#c5c89a] hover:border-[#1F8848] hover:text-[#1F8848]"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Left sidebar: Parent categories ── */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#e0ddba] p-4 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#245433]/50">
              Categorías
            </p>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => { setSelectedParentId(null); setSelectedChildId(null); }}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all duration-200 ${
                  selectedParentId === null
                    ? "bg-[#1F8848] text-white shadow-sm"
                    : "text-[#245433] hover:bg-[#1F8848]/10"
                }`}
              >
                Todos
              </button>
              {parentCats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleParentSelect(cat.id!)}
                  className={`group/cat flex items-center gap-2 w-full rounded-xl px-3 py-2 text-left text-sm transition-all duration-200 ${
                    selectedParentId === cat.id
                      ? "bg-[#1F8848] text-white font-bold shadow-sm"
                      : "text-[#245433] hover:bg-[#1F8848]/10 font-medium"
                  }`}
                >
                  <span className="flex-1 truncate">{cat.nombre}</span>
                  {selectedParentId === cat.id && (
                    <span className="text-white/70 text-xs">▶</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Category info panel */}
            {selectedParentId !== null && (() => {
              const cat = parentCats.find((c) => c.id === selectedParentId);
              if (!cat) return null;
              return (
                <div className="mt-4 border-t border-[#e0ddba] pt-4">
                  {cat.imagen_url && (
                    <img
                      src={cat.imagen_url}
                      alt={cat.nombre}
                      className="mb-2 h-24 w-full rounded-xl object-cover"
                    />
                  )}
                  <p className="text-xs text-[#245433]/70 leading-relaxed">{cat.descripcion}</p>
                </div>
              );
            })()}
          </div>
        </aside>

        {/* ── Main area: Product grid ── */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🍽️</span>
              <p className="text-xl font-bold text-[#245433]">Sin productos en esta categoría</p>
              <p className="mt-1 text-sm text-[#245433]/60">Probá otra combinación de filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
