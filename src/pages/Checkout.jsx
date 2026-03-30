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
      navigate('/tienda')
      return
    }

    setLoading(true)

    if (!supabase) {
      setLoading(false)
      setError(
        'Supabase no está configurado. Agrega tus credenciales para guardar órdenes.',
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
      setError(orderError.message ?? 'No se pudo crear la orden.')
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
        throw new Error('No se pudo iniciar el pago con Square.')
      }

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('Respuesta inválida del backend de Square.')
      }
    } catch (fetchError) {
      setError(fetchError.message ?? 'No se pudo iniciar el pago con Square.')
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          Tu carrito está vacío. Vuelve a la{' '}
          <Link
            to="/tienda"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            tienda
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Revisar y confirmar tu pedido.
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Revisa los productos y completa el pago seguro con Square.
      </p>

      <form
        onSubmit={handleConfirm}
        className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]"
      >
        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Datos de contacto
          </h2>
          {!user && (
            <p className="text-xs text-slate-600">
              Puedes comprar como invitada, pero al iniciar sesión podrás
              acceder a tu historial de pedidos.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 text-xs">
              <label htmlFor="name" className="font-medium text-slate-800">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ej: Mayra González"
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <label htmlFor="email" className="font-medium text-slate-800">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                defaultValue={user?.email ?? ''}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <label htmlFor="notes" className="font-medium text-slate-800">
              Comentarios para el pedido
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              placeholder="Ej: Prefiero retirar en el salón o cualquier indicación especial."
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
            Resumen del pedido
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
                    ${(item.price / 100).toFixed(2)} c/u
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
              <span className="font-semibold text-slate-800">Total a pagar</span>
              <span className="text-sm font-semibold text-rose-700">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              El cobro se procesa con Square mediante un enlace de pago seguro.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
          >
            {loading ? 'Redirigiendo a Square...' : 'Confirmar y pagar'}
          </button>
        </section>
      </form>
    </main>
  )
}

export default Checkout

