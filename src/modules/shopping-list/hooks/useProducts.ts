import { useCallback, useEffect, useState } from 'react'
import { productsService } from '../services/productsService'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await productsService.list()
        if (mounted) setProducts(list)
      } catch (e) {
        // ignore for now
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const addProduct = useCallback(async (name: string) => {
    if (!name.trim()) return
    try {
      const list = await productsService.create({ name })
      setProducts(list)
    } catch (e) {
      // handle error
    }
  }, [])

  const toggleProduct = useCallback(async (id: string) => {
    try {
      const list = await productsService.toggle(id)
      setProducts(list)
    } catch (e) {
      // handle error
    }
  }, [])

  const removeProduct = useCallback(async (id: string) => {
    try {
      const list = await productsService.remove(id)
      setProducts(list)
    } catch (e) {
      // handle error
    }
  }, [])

  return {
    products,
    addProduct,
    toggleProduct,
    removeProduct,
  }
}
