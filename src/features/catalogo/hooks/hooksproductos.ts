import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { IProducto } from "../../productos/IProducto";
import {
  getProductos,
} from "../../productos/services/producto.services";
import { getCategorias } from "../../categoria/services/categoria.services";
import { getIngredientes } from "../../ingredientes/services/ingrediente.services";

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
