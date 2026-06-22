# Store App - Frontend Cliente

Frontend del cliente para la aplicación de Food Store, construido con React, TypeScript y Vite.

## Video de Demostración

[Video de explicacion proyecto](https://youtu.be/k3hljpUq8lQ)

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- pnpm (v8 o superior)

## Instalación y Configuración (Setup)

1. **Instalar dependencias**:
   ```bash
   pnpm i
   ```

2. **Variables de entorno**:
   Copia el archivo `.env.example` a `.env` y configura los valores correspondientes:
   ```bash
   cp .env.example .env
   ```

   Las principales variables requeridas son:
   - `VITE_API_URL`: URL base de la API del backend.
   - `VITE_MP_PUBLIC_KEY`: Clave pública de MercadoPago para el checkout.
   - `VITE_WS_URL`: URL base para la conexión WebSocket.

3. **Ejecutar en desarrollo**:
   ```bash
   pnpm dev
   ```
   La aplicación estará disponible típicamente en `http://localhost:5173`.

## Construcción para Producción

Para generar los archivos estáticos para producción:

```bash
pnpm build
```

Para previsualizar el build de producción localmente:

```bash
pnpm preview
```
