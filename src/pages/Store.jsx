import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Store() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setError(
          'Supabase is not configured. Add your credentials to load products.',
        )
        setLoading(false)
        return
      }

      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (dbError) {
        setError(
          dbError.message ?? 'We could not load products.',
        )
      } else {
        setProducts(data ?? [])
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const total = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  )

  const goToCheckout = () => {
    if (cart.length === 0) return
    navigate('/checkout', { state: { cart } })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            store
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Products to keep your routine at home.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-base">
            Shampoos, treatments, oils and more, selected by our team to match
            your salon services.
          </p>
        </div>
        <div className="text-xs text-slate-600">
          {user ? (
            <p>
              Signed in as{' '}
              <span className="font-semibold">{user.email}</span>
            </p>
          ) : (
            <p>
              <Link
                to="/login"
                className="font-semibold text-rose-700 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>{' '}
              to save your order history.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(260px,1fr)]">
        <section className="space-y-4">
          {loading && <p className="text-sm text-slate-600">Loading products...</p>}
          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-slate-600">
              There are no products in the store yet.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm"
              >
                {product.image_url && (
                  <div className="mb-3 h-40 overflow-hidden rounded-2xl bg-rose-50">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-rose-600">
                    {product.category}
                  </p>
                )}
                {product.description && (
                  <p className="mt-2 text-xs text-slate-600">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="font-semibold text-rose-700">
                    {product.price != null
                      ? `$${(product.price / 100).toFixed(2)}`
                      : 'Ask us'}
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Your cart
          </h3>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-600">
              You haven&apos;t added products yet. Choose one from the list.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.name}{' '}
                      <span className="font-normal text-slate-500">
                        x{item.quantity}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ${(item.price / 100).toFixed(2)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-rose-100 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="text-sm font-semibold text-rose-700">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Payments are processed securely with Square.
            </p>
          </div>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={goToCheckout}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
          >
            Continue to checkout
          </button>
        </aside>
      </div>
    </main>
  )
}

export default Store
