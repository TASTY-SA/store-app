// ─── Skeleton loaders reutilizables ──────────────────────────────────────────

interface SkeletonBase {
  className?: string;
}

/** Bloque genérico con animate-pulse */
export function Skeleton({ className = '' }: SkeletonBase) {
  return (
    <div
      className={`animate-pulse bg-[#e8e5c0]/40 rounded-xl ${className}`}
    />
  );
}

// ─── Variantes de layout ────────────────────────────────────────────────────

/** Esqueleto de una tarjeta de pedido (como TarjetaPedido) */
export function SkeletonPedidoCard() {
  return (
    <div className="animate-pulse rounded-[20px] border border-[#e8e5c0]/50 bg-white/60 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-44" />
        </div>
        <Skeleton className="h-14 w-24 rounded-2xl" />
      </div>
      {/* Barra de progreso */}
      <Skeleton className="h-2 w-full rounded-full" />
      {/* Breakdown */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-24" />
        <div className="border-t border-[#e8e5c0]/50 mt-1 pt-2">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Esqueleto del formulario de edición de perfil */
export function SkeletonPerfilForm() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-[#245433]/10 shadow-md p-6 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="flex gap-3 mt-2">
        <Skeleton className="h-11 rounded-xl flex-1" />
        <Skeleton className="h-11 rounded-xl flex-1" />
      </div>
    </div>
  );
}
