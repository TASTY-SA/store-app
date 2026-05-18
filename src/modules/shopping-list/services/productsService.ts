import type { CreateProductInput, Product } from '../types'

const API = 'http://localhost:3000/products'

async function handleResp(res: Response) {
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || res.statusText)
  }
  return res.json()
}

export const productsService = {
  async list(): Promise<Product[]> {
    const res = await fetch(API)
    return handleResp(res) as Promise<Product[]>
  },

  async create(input: CreateProductInput): Promise<Product[]> {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input.name.trim(), done: false }),
    })

    await handleResp(res)
    return this.list()
  },

  async toggle(id: string): Promise<Product[]> {
    const itemRes = await fetch(`${API}/${id}`)
    const item = await handleResp(itemRes)

    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !item.done }),
    })

    await handleResp(res)
    return this.list()
  },

  async remove(id: string): Promise<Product[]> {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    await handleResp(res)
    return this.list()
  },
}
