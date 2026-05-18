import type { Product } from '../types'

type ProductItemProps = {
  product: Product
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function ProductItem({ product, onToggle, onRemove }: ProductItemProps) {
  return (
    <li className="product-item">
      <label>
        <input
          type="checkbox"
          checked={product.done}
          onChange={() => onToggle(product.id)}
        />
        <span className={product.done ? 'done' : ''}>{product.name}</span>
      </label>

      <button
        type="button"
        className="button button-danger"
        onClick={() => onRemove(product.id)}
      >
        Quitar
      </button>
    </li>
  )
}
