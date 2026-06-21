import type { ICategoria } from "../catalogo/ICategoria";

export interface IProducto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock_cantidad: number;
  unidad_medida: IUnidadMedida;
  imagenes_url?: string[];
  imagen_url?: string;
  is_active?: boolean;
  categorias?: ICategoria[];
  ingredientes?: IIngrediente[];
}

export interface IIngrediente {
  id?: number;
  nombre: string;
  descripcion: string;
  es_alergeno: boolean;
  is_active?: boolean;
}

export interface IUnidadMedida {
  id?: number;
  nombre: string;
  simbolo: string;
  tipo: string;
  is_active: boolean;
}



