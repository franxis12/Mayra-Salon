import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

const WEEK_DAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

function Dashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [team, setTeam] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    active: true,
  })

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    photoUrl: '',
    phone: '',
    scheduleSlots: WEEK_DAYS.map((day) => ({
      id: day.id,
      label: day.label,
      from: '',
      to: '',
      enabled: false,
    })),
    description: '',
    specializationStartYear: '',
    active: true,
  })

  const loadProducts = async () => {
    if (!supabase) {
      setError(
        'Supabase no está configurado. Agrega tus credenciales para administrar productos.',
      )
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message ?? 'No se pudieron cargar los productos.')
    } else {
      setProducts(data ?? [])
    }
    setLoading(false)
  }

  const loadTeam = async () => {
    if (!supabase) {
      setTeamError(
        'Supabase no está configurado. Agrega tus credenciales para administrar el equipo.',
      )
      setTeamLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })

    if (dbError) {
      setTeamError(dbError.message ?? 'No se pudo cargar el equipo.')
    } else {
      setTeam(data ?? [])
    }
    setTeamLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) return
    loadProducts()
    loadTeam()
  }, [authLoading, isAdmin])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleTeamChange = (event) => {
    const { name, value, type, checked } = event.target
    setTeamForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateScheduleSlot = (dayId, partial) => {
    setTeamForm((current) => {
      const slots = current.scheduleSlots || []
      const nextSlots = slots.map((slot) =>
        slot.id === dayId ? { ...slot, ...partial } : slot,
      )
      return { ...current, scheduleSlots: nextSlots }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!supabase) {
      setError('Supabase no está configurado.')
      return
    }

    const priceInCents = Math.round(Number(form.price || 0) * 100)

    const { error: insertError } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      category: form.category || null,
      image_url: form.imageUrl || null,
      price: priceInCents,
      active: form.active,
    })

    if (insertError) {
      setError(insertError.message ?? 'No se pudo crear el producto.')
      return
    }

    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      active: true,
    })

    loadProducts()
  }

  const handleTeamSubmit = async (event) => {
    event.preventDefault()
    setTeamError('')

    if (!supabase) {
      setTeamError('Supabase no está configurado.')
      return
    }

    const specializationYear = teamForm.specializationStartYear
      ? Number(teamForm.specializationStartYear)
      : null

    const activeSlots =
      teamForm.scheduleSlots?.filter(
        (slot) => slot.enabled && slot.from && slot.to,
      ) ?? []

    const schedulePayload = activeSlots.length
      ? JSON.stringify(
          activeSlots.map(({ id, label, from, to }) => ({
            id,
            label,
            from,
            to,
          })),
        )
      : null

    const { error: insertError } = await supabase.from('team_members').insert({
      name: teamForm.name,
      role: teamForm.role || null,
      photo_url: teamForm.photoUrl || null,
      phone: teamForm.phone || null,
      schedule: schedulePayload,
      description: teamForm.description || null,
      specialization_start_year: specializationYear,
      active: teamForm.active,
    })

    if (insertError) {
      setTeamError(insertError.message ?? 'No se pudo crear el miembro.')
      return
    }

    setTeamForm({
      name: '',
      role: '',
      photoUrl: '',
      phone: '',
      scheduleSlots: WEEK_DAYS.map((day) => ({
        id: day.id,
        label: day.label,
        from: '',
        to: '',
        enabled: false,
      })),
      description: '',
      specializationStartYear: '',
      active: true,
    })

    setTeamLoading(true)
    loadTeam()
  }

  const toggleActive = async (product) => {
    if (!supabase) return
    const { error: updateError } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)

    if (!updateError) {
      loadProducts()
    }
  }

  const toggleTeamActive = async (member) => {
    if (!supabase) return
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ active: !member.active })
      .eq('id', member.id)

    if (!updateError) {
      loadTeam()
    }
  }

  if (authLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-600">Verificando acceso...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          Esta sección es solo para la dueña del salón. Asegúrate de iniciar
          sesión con el correo configurado como administrador.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Panel de administración
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Gestiona los productos de la tienda y el equipo del salón.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1.6fr)]">
        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Agregar nuevo producto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="name" className="font-medium text-slate-800">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ej: Tratamiento hidratante"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="font-medium text-slate-800"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Breve descripción del producto."
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="imageUrl"
                className="font-medium text-slate-800"
              >
                URL de la imagen
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="https://... (imagen del producto)"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="price"
                  className="font-medium text-slate-800"
                >
                  Precio (USD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ej: 25.50"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="category"
                  className="font-medium text-slate-800"
                >
                  Categoría
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ej: Cabello, Tratamientos..."
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="active" className="text-xs text-slate-800">
                  Producto visible en la tienda
                </label>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Guardar producto
            </button>
          </form>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Productos cargados
          </h2>
          {loading && (
            <p className="text-xs text-slate-600">Cargando productos...</p>
          )}
          {!loading && products.length === 0 && (
            <p className="text-xs text-slate-600">
              Aún no hay productos en la base de datos.
            </p>
          )}
          <ul className="space-y-2 text-xs">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  {product.image_url && (
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-rose-50">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">
                      {product.name}
                      {product.category ? (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-rose-600">
                          {product.category}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ${((product.price ?? 0) / 100).toFixed(2)} ·{' '}
                      {product.active ? 'Visible en tienda' : 'Oculto'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleActive(product)}
                  className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                >
                  {product.active ? 'Ocultar' : 'Mostrar'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1.6fr)]">
        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Agregar miembro del equipo
          </h2>
          <form onSubmit={handleTeamSubmit} className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="team-name" className="font-medium text-slate-800">
                Nombre (obligatorio)
              </label>
              <input
                id="team-name"
                name="name"
                type="text"
                required
                value={teamForm.name}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ej: Mayra González"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="team-role" className="font-medium text-slate-800">
                  Rol / especialidad
                </label>
                <input
                  id="team-role"
                  name="role"
                  type="text"
                  value={teamForm.role}
                  onChange={handleTeamChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ej: Manicurista, Colorista…"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="team-phone" className="font-medium text-slate-800">
                  Teléfono personal
                </label>
                <input
                  id="team-phone"
                  name="phone"
                  type="tel"
                  value={teamForm.phone}
                  onChange={handleTeamChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ej: (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-photoUrl"
                className="font-medium text-slate-800"
              >
                URL de la foto
              </label>
              <input
                id="team-photoUrl"
                name="photoUrl"
                type="url"
                value={teamForm.photoUrl}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="https://... (foto del miembro)"
              />
            </div>

            <div className="space-y-1.5">
              <p className="font-medium text-slate-800">Horarios</p>
              <p className="text-[11px] text-slate-500">
                Marca los días y horarios. Ej: lunes 10:00 a 15:00, martes
                10:00 a 14:00.
              </p>
              <div className="mt-2 grid gap-2 text-[11px] md:grid-cols-2">
                {teamForm.scheduleSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-2 py-1.5"
                  >
                    <input
                      type="checkbox"
                      id={`day-${slot.id}`}
                      checked={slot.enabled}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
                    />
                    <label
                      htmlFor={`day-${slot.id}`}
                      className="w-16 text-[11px] font-semibold text-slate-800"
                    >
                      {slot.label}
                    </label>
                    <input
                      type="time"
                      value={slot.from}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          from: event.target.value,
                        })
                      }
                      className="flex-1 rounded-lg border border-rose-100 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                    />
                    <span className="text-[11px] text-slate-500">a</span>
                    <input
                      type="time"
                      value={slot.to}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          to: event.target.value,
                        })
                      }
                      className="flex-1 rounded-lg border border-rose-100 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-specializationStartYear"
                className="font-medium text-slate-800"
              >
                Año en que empezó su especialización
              </label>
              <input
                id="team-specializationStartYear"
                name="specializationStartYear"
                type="number"
                min="1980"
                max={new Date().getFullYear()}
                value={teamForm.specializationStartYear}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ej: 2021"
              />
              <p className="text-[11px] text-slate-500">
                Se calcularán los años de experiencia a partir de este año.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-description"
                className="font-medium text-slate-800"
              >
                Descripción
              </label>
              <textarea
                id="team-description"
                name="description"
                rows={3}
                value={teamForm.description}
                onChange={handleTeamChange}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Cuenta brevemente su estilo, experiencia o qué la hace especial."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="team-active"
                name="active"
                type="checkbox"
                checked={teamForm.active}
                onChange={handleTeamChange}
                className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="team-active" className="text-xs text-slate-800">
                Mostrar en la página pública de equipo
              </label>
            </div>

            {teamError && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {teamError}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Guardar miembro
            </button>
          </form>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Equipo del salón
          </h2>
          {teamLoading && (
            <p className="text-xs text-slate-600">Cargando equipo...</p>
          )}
          {!teamLoading && team.length === 0 && !teamError && (
            <p className="text-xs text-slate-600">
              Aún no cargaste miembros del equipo.
            </p>
          )}
          {teamError && !teamLoading && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {teamError}
            </p>
          )}
          <ul className="space-y-2 text-xs">
            {team.map((member) => {
              const currentYear = new Date().getFullYear()
              const startYear = member.specialization_start_year
              const years =
                typeof startYear === 'number' && startYear > 1900
                  ? currentYear - startYear
                  : null

              let parsedSchedule = null
              if (member.schedule) {
                try {
                  const maybe = JSON.parse(member.schedule)
                  if (Array.isArray(maybe)) {
                    parsedSchedule = maybe
                  }
                } catch {
                  parsedSchedule = null
                }
              }

              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {member.photo_url && (
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-rose-50">
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {member.role && <span>{member.role}</span>}
                        {member.role && years ? ' · ' : null}
                        {years ? `${years} años de experiencia` : null}
                      </p>
                      {parsedSchedule ? (
                        <ul className="mt-0.5 space-y-0.5">
                          {parsedSchedule.map((slot) => (
                            <li
                              key={slot.id}
                              className="text-[11px] text-slate-500"
                            >
                              <span className="font-semibold text-slate-800">
                                {slot.label}:
                              </span>{' '}
                              {slot.from} – {slot.to}
                            </li>
                          ))}
                        </ul>
                      ) : member.schedule ? (
                        <p className="text-[11px] text-slate-500">
                          {member.schedule}
                        </p>
                      ) : null}
                      {member.phone && (
                        <p className="text-[11px] text-slate-500">
                          Tel: {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTeamActive(member)}
                    className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                  >
                    {member.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
