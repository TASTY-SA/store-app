import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { getPerfilCliente } from "../services/perfilService";
import type { ICliente } from "../IClientes";

const FOTO_STORAGE_KEY = "perfil_foto_cliente";

export function usePerfilCliente() {
  const { user, isAuthenticated } = useAuthStore();
  const [perfil, setPerfil] = useState<ICliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga la foto de perfil desde localStorage
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(() => {
    return localStorage.getItem(FOTO_STORAGE_KEY);
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const cargarPerfil = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPerfilCliente();
        setPerfil(data);
      } catch {
        setError("No se pudo cargar el perfil. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarPerfil();
  }, [isAuthenticated]);

  /** Permite al usuario elegir una foto de perfil desde su disco */
  const handleFotoChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFotoPerfil(dataUrl);
      localStorage.setItem(FOTO_STORAGE_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  /** Elimina la foto de perfil personalizada */
  const handleFotoRemove = () => {
    setFotoPerfil(null);
    localStorage.removeItem(FOTO_STORAGE_KEY);
  };

  return {
    perfil: perfil ?? (user as ICliente | null),
    fotoPerfil,
    isLoading,
    error,
    handleFotoChange,
    handleFotoRemove,
  };
}
