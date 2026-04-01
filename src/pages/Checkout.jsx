import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cart = location.state?.cart ?? []
  const total = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  )

  const handleConfirm = async (event) => {
    event.preventDefault()
    setError('')

    if (cart.length === 0) {
      navigate('/store')
      return
    }

    setLoading(true)

    if (!supabase) {
      setLoading(false)
      setError(
        'Supabase is not configured. Add your credentials to save orders.',
      )
      return
    }

    const { error: orderError } = await supabase.from('orders').insert({
      user_id: user?.id ?? null,
      total_amount: total,
      status: 'pending',
      items: cart,
    })

    if (orderError) {
      setLoading(false)
      setError(
        orderError.message ?? 'We could not create the order.',
      )
      return
    }

    const backendUrl = import.meta.env.VITE_SQUARE_BACKEND_URL

    if (!backendUrl) {
      setLoading(false)
      alert(
        'Orden creada en Supabase. Configura VITE_SQUARE_BACKEND_URL para redirigir a Square y completar el pago.',
      )
      navigate('/')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'USD',
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Could not start payment with Square.')
      }

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('Invalid response from the Square backend.')
      }
    } catch (fetchError) {
      setError(
        fetchError.message ?? 'Could not start payment with Square.',
      )
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          Your cart is empty. Go back to the{' '}
          <Link
            to="/store"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            store
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Review and confirm your order.
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Review the products and complete payment securely with Square.
      </p>

      <form
        onSubmit={handleConfirm}
        className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]"
      >
        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Contact details
          </h2>
          {!user && (
            <p className="text-xs text-slate-600">
              You can buy as a guest, but if you sign in you&apos;ll be able to
              see your order history.
            </p>
          )}
            <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 text-xs">
                <label htmlFor="name" className="font-medium text-slate-800">
                  Full name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ex: Mayra Gonzalez"
              />
            </div>
            <div className="space-y-1.5 text-xs">
                <label htmlFor="email" className="font-medium text-slate-800">
                  Email
              </label>
              <input
                id="email"
                type="email"
                required
                defaultValue={user?.email ?? ''}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="example@email.com"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <label htmlFor="notes" className="font-medium text-slate-800">
              Order notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              placeholder="Ex: I prefer pick-up at the salon or any special indication."
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Order summary
          </h2>
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
                <p className="text-[11px] font-semibold text-slate-800">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-rose-100 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Total to pay</span>
              <span className="text-sm font-semibold text-rose-700">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              The charge is processed with Square through a secure payment link.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
          >
            {loading ? 'Redirecting to Square...' : 'Confirm and pay'}
          </button>
        </section>
      </form>
    </main>
  )
}

export default Checkout
