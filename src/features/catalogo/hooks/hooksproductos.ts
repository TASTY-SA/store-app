import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProductos } from "../../productos/services/producto.services";

export const useProductos = () => {
  const [currentPage] = useState(1);
  const LIMIT = 20;

  const { data: productos, isLoading } = useQuery({
    queryKey: ["productos", currentPage],
    queryFn: () => getProductos((currentPage - 1) * LIMIT, LIMIT),
    staleTime: 1000 * 60 * 2,
  });

  return {
    productos,
    isLoading,
  };
};
