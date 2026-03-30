import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const action = mode === 'login' ? signIn : signUp
    const { error: authError } = await action(email, password)

    setLoading(false)

    if (authError) {
      setError(authError.message ?? 'Ocurrió un error. Intenta de nuevo.')
      return
    }

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const isOwner =
      adminEmail &&
      email &&
      email.toLowerCase() === adminEmail.toLowerCase()

    const target = from || (isOwner ? '/dashboard' : '/tienda')
    navigate(target, { replace: true })
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-10 md:py-14">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Usa tu correo para gestionar tus turnos y compras. Si eres la dueña,
        inicia sesión con el correo configurado como administrador.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm"
      >
        <div className="space-y-1.5 text-xs">
          <label htmlFor="email" className="font-medium text-slate-800">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div className="space-y-1.5 text-xs">
          <label htmlFor="password" className="font-medium text-slate-800">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
        >
          {loading
            ? 'Procesando...'
            : mode === 'login'
              ? 'Entrar'
              : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-600">
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="font-semibold text-rose-700 underline-offset-4 hover:underline"
        >
          {mode === 'login' ? 'Crea una nueva' : 'Inicia sesión'}
        </button>
      </p>

      <p className="mt-6 text-center text-xs text-slate-500">
        Al continuar aceptas las políticas de privacidad del salón.
      </p>
      <p className="mt-1 text-center text-xs text-slate-500">
        Vuelve al{' '}
        <Link
          to="/"
          className="font-semibold text-rose-700 underline-offset-4 hover:underline"
        >
          inicio
        </Link>
        .
      </p>
    </main>
  )
}

export default Login
