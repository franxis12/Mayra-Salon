import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useCart } from '../context/CartContext.jsx'

function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      if (!supabase) {
        setError('Supabase is not configured. Add your credentials to load products.')
        setLoading(false)
        return
      }

      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (dbError) {
        setError(dbError.message ?? 'We could not load this product.')
      } else if (!data) {
        setError('Product not found.')
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    const qty = Number.isNaN(Number(quantity)) ? 1 : Math.max(1, Number(quantity))
    addItem(product, qty)
    navigate('/store')
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-600">Loading product...</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          {error || 'We could not find this product.'}
        </p>
        <p className="mt-2 text-xs text-slate-600">
          <Link
            to="/store"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            Go back to store
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] md:items-start">
        <div className="space-y-4">
          {product.image_url && (
            <div className="overflow-hidden rounded-3xl border border-rose-100 bg-rose-50 shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-80 w-full object-cover md:h-96"
              />
            </div>
          )}
        </div>
        <div className="space-y-3 text-sm text-slate-700">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-600">
            d&apos;mayra product
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {product.name}
          </h1>
          {product.category && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-600">
              {product.category}
            </p>
          )}
          <p className="text-lg font-semibold text-rose-700">
            {product.price != null
              ? `$${(product.price / 100).toFixed(2)}`
              : 'Ask us for the price'}
          </p>
          {product.description && (
            <p className="text-xs text-slate-600">{product.description}</p>
          )}

          <div className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
            {product.sku && (
              <p>
                <span className="font-semibold text-slate-800">SKU:</span>{' '}
                {product.sku}
              </p>
            )}
            {product.stock != null && !Number.isNaN(product.stock) && (
              <p>
                <span className="font-semibold text-slate-800">Available:</span>{' '}
                {product.stock} units
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="space-y-1">
              <label
                htmlFor="quantity"
                className="block text-[11px] font-medium text-slate-800"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="w-20 rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              />
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center rounded-full bg-rose-600 px-6 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Add to cart
            </button>
            <Link
              to="/store"
              className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-50"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Product

