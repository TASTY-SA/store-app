import type { ICategoria } from "../../categoria/ICategoria";

const BASE_URL = `${import.meta.env.VITE_API_URL}/categorias`;

export const getCategorias = async (): Promise<{ data: ICategoria[]; total: number }> => {

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Error al obtener las categorías");
    const data = await response.json();
    return data;
  } catch (error) {

    console.log(error);
    throw error; 
  }
};

export const getCategoriaById = async (id: number): Promise<ICategoria> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data: ICategoria = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};
