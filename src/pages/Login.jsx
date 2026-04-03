import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('United States')
  const [role, setRole] = useState('client')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register' && !acceptedTerms) {
      setLoading(false)
      setError('You must accept the Terms of Use and Privacy Policy to create an account.')
      return
    }

    const action = mode === 'login' ? signIn : signUp
    const { data, error: authError } = await action(email, password)

    if (authError) {
      setLoading(false)
      setError(authError.message ?? 'Something went wrong. Please try again.')
      return
    }

    if (mode === 'register' && supabase && data?.user) {
      const profilePayload = {
        id: data.user.id,
        full_name: fullName || null,
        phone: phone || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        city: city || null,
        state_province: stateProvince || null,
        postal_code: postalCode || null,
        country: country || null,
        role: role || 'client',
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })

      if (profileError) {
        // No bloqueamos el login, pero mostramos un mensaje
        console.error(profileError)
        setError(
          profileError.message ??
            'Your account was created, but there was a problem saving your profile details.',
        )
      }
    }

    setLoading(false)

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const isOwner =
      adminEmail &&
      email &&
      email.toLowerCase() === adminEmail.toLowerCase()

    const target = from || (isOwner ? '/dashboard' : '/store')
    navigate(target, { replace: true })
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-10 md:py-14">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {mode === 'login' ? 'Sign in' : 'Create your account'}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Use your email to manage your appointments and orders. If you are the
        owner, sign in with the email configured as administrator.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm"
      >
        {mode === 'register' && (
          <div className="space-y-1.5 text-xs">
            <label htmlFor="fullName" className="font-medium text-slate-800">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              placeholder="Ex: Mayra Gonzalez"
            />
          </div>
        )}
        <div className="space-y-1.5 text-xs">
          <label htmlFor="email" className="font-medium text-slate-800">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="example@email.com"
          />
        </div>
        <div className="space-y-1.5 text-xs">
          <label htmlFor="password" className="font-medium text-slate-800">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="At least 6 characters"
          />
        </div>

        {mode === 'register' && (
          <>
            <div className="space-y-1.5 text-xs">
              <label htmlFor="phone" className="font-medium text-slate-800">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ex: (555) 123-4567"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label
                htmlFor="addressLine1"
                className="font-medium text-slate-800"
              >
                Shipping address
              </label>
              <input
                id="addressLine1"
                type="text"
                required
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Street and number"
              />
              <input
                id="addressLine2"
                type="text"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Apartment / floor (optional)"
              />
            </div>

            <div className="grid gap-3 text-xs md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="city" className="font-medium text-slate-800">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="City"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="state" className="font-medium text-slate-800">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={stateProvince}
                  onChange={(event) => setStateProvince(event.target.value)}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: RI"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="postalCode"
                  className="font-medium text-slate-800"
                >
                  Zip / Postal code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="ZIP / Postal code"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="country" className="font-medium text-slate-800">
                Country
              </label>
              <input
                id="country"
                type="text"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Country"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-medium text-slate-800">
                Account type / role
              </p>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={(event) => setRole(event.target.value)}
                    className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-700">Client</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="role"
                    value="barber"
                    checked={role === 'barber'}
                    onChange={(event) => setRole(event.target.value)}
                    className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-700">Barber</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="role"
                    value="stylist"
                    checked={role === 'stylist'}
                    onChange={(event) => setRole(event.target.value)}
                    className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-700">Stylist</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="inline-flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] text-slate-600">
                  I have read and accept the{' '}
                  <Link
                    to="/terms"
                    className="font-semibold text-rose-700 underline-offset-4 hover:underline"
                  >
                    Terms of Use
                  </Link>{' '}
                  and the{' '}
                  <Link
                    to="/privacy"
                    className="font-semibold text-rose-700 underline-offset-4 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || (mode === 'register' && !acceptedTerms)}
          className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
        >
          {loading
            ? 'Processing...'
            : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-600">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
            setAcceptedTerms(false)
          }}
          className="font-semibold text-rose-700 underline-offset-4 hover:underline"
        >
          {mode === 'login' ? 'Create a new one' : 'Sign in'}
        </button>
      </p>

      <p className="mt-6 text-center text-xs text-slate-500">
        By continuing you accept the salon&apos;s privacy policy.
      </p>
      <p className="mt-1 text-center text-xs text-slate-500">
        Back to{' '}
        <Link
          to="/"
          className="font-semibold text-rose-700 underline-offset-4 hover:underline"
        >
          home
        </Link>
        .
      </p>
    </main>
  )
}

export default Login
