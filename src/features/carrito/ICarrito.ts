import type { IProducto } from "../productos/IProducto";

export interface ICarritoItem {
  producto: IProducto;
  cantidad: number;
  notas?: string;
}

export interface ICarrito {
  items: ICarritoItem[];
}
