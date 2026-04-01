import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

function Profile() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United States',
    role: 'client',
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return
      if (!user || !supabase) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        setError(
          profileError.message ??
            'We could not load your information. Please try again.',
        )
      } else if (data) {
        setForm({
          fullName: data.full_name ?? '',
          phone: data.phone ?? '',
          addressLine1: data.address_line1 ?? '',
          addressLine2: data.address_line2 ?? '',
          city: data.city ?? '',
          stateProvince: data.state_province ?? '',
          postalCode: data.postal_code ?? '',
          country: data.country ?? 'United States',
          role: data.role ?? 'client',
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [authLoading, user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!user || !supabase) return

    setError('')
    setSuccess('')
    setSaving(true)

    const payload = {
      id: user.id,
      full_name: form.fullName || null,
      phone: form.phone || null,
      address_line1: form.addressLine1 || null,
      address_line2: form.addressLine2 || null,
      city: form.city || null,
      state_province: form.stateProvince || null,
      postal_code: form.postalCode || null,
      country: form.country || null,
      role: form.role || 'client',
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })

    if (profileError) {
      setError(
        profileError.message ??
          'We could not save your data. Please try again.',
      )
    } else {
      setSuccess('Your information has been updated.')
    }

    setSaving(false)
  }

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-600">Loading your information...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          To edit your personal information, you need to{' '}
          <Link
            to="/login"
            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
          >
            sign in
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        Your personal information
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        This information will be used for your orders and so the salon can
        contact you.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-xs text-slate-700 shadow-sm"
      >
        <div className="space-y-1.5">
          <label className="font-medium text-slate-800">Email</label>
          <p className="rounded-xl border border-rose-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            {user.email}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fullName" className="font-medium text-slate-800">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Ex: Mayra Gonzalez"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="font-medium text-slate-800">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Ex: (555) 123-4567"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="addressLine1"
            className="font-medium text-slate-800"
          >
            Shipping address
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            required
            value={form.addressLine1}
            onChange={handleChange}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Street and number"
          />
          <input
            id="addressLine2"
            name="addressLine2"
            type="text"
            value={form.addressLine2}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Apartment / floor (optional)"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="city" className="font-medium text-slate-800">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              placeholder="City"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="stateProvince"
              className="font-medium text-slate-800"
            >
              State / Province
            </label>
            <input
              id="stateProvince"
              name="stateProvince"
              type="text"
              required
              value={form.stateProvince}
              onChange={handleChange}
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
              name="postalCode"
              type="text"
              required
              value={form.postalCode}
              onChange={handleChange}
              className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              placeholder="ZIP / Postal code"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="country" className="font-medium text-slate-800">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={form.country}
            onChange={handleChange}
            className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
            placeholder="Country"
          />
        </div>

        <div className="space-y-1.5">
          <p className="font-medium text-slate-800">Account type / role</p>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="role"
                value="client"
                checked={form.role === 'client'}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-700">Client</span>
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="role"
                value="barber"
                checked={form.role === 'barber'}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-700">Barber</span>
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="role"
                value="stylist"
                checked={form.role === 'stylist'}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-700">Stylist</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
        >
          {saving ? 'Saving changes...' : 'Save changes'}
        </button>
      </form>
    </main>
  )
}

export default Profile
