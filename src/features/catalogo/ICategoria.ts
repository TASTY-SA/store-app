export interface ICategoria {
  id?: number;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
  parent_id?: number | null;
  is_active?: boolean;
}
