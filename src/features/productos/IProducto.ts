import type { ICategoria } from "../categoria/ICategoria";

export interface IProducto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock_cantidad: number;
  imagen_url: string;
  is_active?: boolean;
  categorias?: ICategoria[];
}

