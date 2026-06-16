import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IProducto } from '../features/productos/IProducto'
import type { ICarritoItem } from '../features/carrito/ICarrito'

export interface CartState {
  items: ICarritoItem[]
  addToCart: (producto: IProducto, cantidad?: number, notas?: string) => void
  removeFromCart: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  updateNotes: (productoId: number, notas: string) => void
  clearCart: () => void
  subtotal: number
  totalItems: number
}

const getSubtotal = (items: ICarritoItem[]) => {
  return items.reduce((acc, item) => acc + item.producto.precio_base * item.cantidad, 0)
}

const getTotalItems = (items: ICarritoItem[]) => {
  return items.reduce((acc, item) => acc + item.cantidad, 0)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      totalItems: 0,
      
      addToCart: (producto, cantidad = 1, notas = '') => {
        const items = get().items
        const existingIndex = items.findIndex((item) => item.producto.id === producto.id)
        
        let newItems: ICarritoItem[]
        if (existingIndex > -1) {
          newItems = [...items]
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            cantidad: newItems[existingIndex].cantidad + cantidad,
            notas: notas ? notas : newItems[existingIndex].notas
          }
        } else {
          newItems = [...items, { producto, cantidad, notas }]
        }
        
        set({
          items: newItems,
          subtotal: getSubtotal(newItems),
          totalItems: getTotalItems(newItems)
        })
      },
      
      removeFromCart: (productoId) => {
        const items = get().items.filter((item) => item.producto.id !== productoId)
        set({
          items,
          subtotal: getSubtotal(items),
          totalItems: getTotalItems(items)
        })
      },
      
      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeFromCart(productoId)
          return
        }
        const items = get().items.map((item) =>
          item.producto.id === productoId ? { ...item, cantidad } : item
        )
        set({
          items,
          subtotal: getSubtotal(items),
          totalItems: getTotalItems(items)
        })
      },
      
      updateNotes: (productoId, notas) => {
        const items = get().items.map((item) =>
          item.producto.id === productoId ? { ...item, notas } : item
        )
        set({
          items,
          subtotal: getSubtotal(items),
          totalItems: getTotalItems(items)
        })
      },
      
      clearCart: () => {
        set({ items: [], subtotal: 0, totalItems: 0 })
      }
    }),
    {
      name: 'foodstore_cart',
    }
  )
)
