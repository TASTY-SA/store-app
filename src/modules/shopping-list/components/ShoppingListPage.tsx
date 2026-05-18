import { useAuthStore } from '../../auth'
import { ProductForm } from './ProductForm'
import { ProductItem } from './ProductItem'
import { useProducts } from '../hooks/useProducts'

export function ShoppingListPage() {
  const { user, logout } = useAuthStore()
  const { products, addProduct, toggleProduct, removeProduct } = useProducts()
  const pending = products.filter((p) => !p.done)
  const completed = products.filter((p) => p.done)

  return (
    <section className="card">
      <header className="section-header">
        <div>
          <h1>Shopping List</h1>
          <p className="hint">Sesion iniciada con: {user?.email}</p>
        </div>
        <button type="button" className="button button-ghost" onClick={logout}>
          Cerrar sesion
        </button>
      </header>

      <ProductForm onSubmit={addProduct} />

      <h3 style={{ marginTop: '1rem' }}>Pendientes</h3>
      <ul className="products-list">
        {pending.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onToggle={toggleProduct}
            onRemove={removeProduct}
          />
        ))}
      </ul>

      {pending.length === 0 && (
        <p className="hint">No hay productos pendientes.</p>
      )}

      <hr style={{ margin: '1.25rem 0' }} />

      <h3>Completados</h3>
      <ul className="products-list">
        {completed.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onToggle={toggleProduct}
            onRemove={removeProduct}
          />
        ))}
      </ul>

      {completed.length === 0 && (
        <p className="hint">No hay productos completados.</p>
      )}
    </section>
  )
}
