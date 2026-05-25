import { useSyncExternalStore } from 'react'
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

// Cargar estado inicial desde localStorage
const loadInitialCart = (): ICarritoItem[] => {
  try {
    const saved = localStorage.getItem('foodstore_cart')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Error al cargar el carrito desde localStorage:', e)
    return []
  }
}

const saveCart = (items: ICarritoItem[]) => {
  try {
    localStorage.setItem('foodstore_cart', JSON.stringify(items))
  } catch (e) {
    console.error('Error al guardar el carrito en localStorage:', e)
  }
}

const getSubtotal = (items: ICarritoItem[]) => {
  return items.reduce((acc, item) => acc + item.producto.precio_base * item.cantidad, 0)
}

const getTotalItems = (items: ICarritoItem[]) => {
  return items.reduce((acc, item) => acc + item.cantidad, 0)
}

const listeners = new Set<() => void>()

const emitChange = () => {
  for (const listener of listeners) {
    listener()
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Definimos las funciones que actualizan el estado mutando o creando una nueva referencia
const addToCart = (producto: IProducto, cantidad = 1, notas = '') => {
  const items = currentState.items
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
  
  updateState(newItems)
}

const removeFromCart = (productoId: number) => {
  const items = currentState.items.filter((item) => item.producto.id !== productoId)
  updateState(items)
}

const updateQuantity = (productoId: number, cantidad: number) => {
  if (cantidad <= 0) {
    removeFromCart(productoId)
    return
  }
  const items = currentState.items.map((item) =>
    item.producto.id === productoId ? { ...item, cantidad } : item
  )
  updateState(items)
}

const updateNotes = (productoId: number, notas: string) => {
  const items = currentState.items.map((item) =>
    item.producto.id === productoId ? { ...item, notas } : item
  )
  updateState(items)
}

const clearCart = () => {
  updateState([])
}

// Función auxiliar para actualizar el estado global y guardar
const updateState = (items: ICarritoItem[]) => {
  currentState = {
    ...currentState,
    items,
    subtotal: getSubtotal(items),
    totalItems: getTotalItems(items)
  }
  saveCart(items)
  emitChange()
}

// Inicializar el estado global
const initialItems = loadInitialCart()
let currentState: CartState = {
  items: initialItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  updateNotes,
  clearCart,
  subtotal: getSubtotal(initialItems),
  totalItems: getTotalItems(initialItems)
}

export function useCartStore(): CartState
export function useCartStore<T>(selector: (state: CartState) => T): T
export function useCartStore<T>(selector?: (state: CartState) => T) {
  const selectState = selector ?? ((state: CartState) => state as unknown as T)

  return useSyncExternalStore(
    subscribe,
    () => selectState(currentState),
    () => selectState(currentState)
  )
}
