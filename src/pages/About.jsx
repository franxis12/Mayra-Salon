import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

function About() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeam = async () => {
      if (!supabase) {
        setError(
          'Conecta Supabase para mostrar el equipo de forma dinámica.',
        )
        setLoading(false)
        return
      }

      const { data, error: dbError } = await supabase
        .from('team_members')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (dbError) {
        setError(dbError.message ?? 'No se pudo cargar el equipo.')
      } else {
        setTeam(data ?? [])
      }
      setLoading(false)
    }

    loadTeam()
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-start">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            nosotras
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Un equipo que ama cuidar de ti.
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Mayra Salon nació del deseo de crear un espacio femenino, cálido y
            profesional donde cada clienta se sienta escuchada y acompañada. Nos
            enfocamos en escucharte y aconsejarte para encontrar el estilo que
            mejor resalta tu esencia.
          </p>
          <p className="text-sm text-slate-600 md:text-base">
            Trabajamos con productos seleccionados y nos capacitamos
            constantemente para ofrecerte las últimas tendencias en coloración,
            cortes y cuidado integral.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Mayra</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                estilista &amp; colorista
              </p>
              <p>
                Especialista en coloración, mechas y cambios de imagen. Su
                objetivo es que te vayas del salón sintiéndote renovada.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Equipo Mayra</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                manicuristas &amp; maquillaje
              </p>
              <p>
                Un equipo atento a cada detalle, desde tus manos y pies hasta el
                look perfecto para tu evento especial.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Nuestro espacio
          </h3>
          <p>
            Luz cálida, aromas suaves, música relajante y una atención cercana.
            Buscamos que tu cita sea un momento de pausa en tu rutina.
          </p>
          <ul className="space-y-2 text-xs">
            <li>• Ubicación céntrica con fácil acceso.</li>
            <li>• Ambiente íntimo y acogedor, pensado para pocas clientas a la vez.</li>
            <li>• Área de manicure y pedicure tipo spa.</li>
            <li>• Estaciones de peinado cómodas y luminosas.</li>
          </ul>
        </section>
      </div>

      <section className="mt-10 space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            equipo
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Conoce a quienes cuidan de ti.
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
            Cada miembro del equipo tiene su estilo y especialidad. Aquí puedes
            ver sus horarios, experiencia y una forma de contactarlos.
          </p>
        </div>

        {loading && (
          <p className="text-center text-xs text-slate-600">
            Cargando equipo...
          </p>
        )}
        {error && !loading && (
          <p className="mx-auto max-w-xl rounded-2xl bg-rose-50 px-4 py-3 text-center text-xs text-rose-700">
            {error}
          </p>
        )}
        {!loading && !error && team.length === 0 && (
          <p className="text-center text-xs text-slate-600">
            Aún no hay miembros cargados. Puedes añadirlos desde el panel de
            administración.
          </p>
        )}

        {!loading && !error && team.length > 0 && (
          <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <article
                  key={member.id}
                  className="flex flex-col rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-3">
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
                      <p className="text-sm font-semibold text-slate-900">
                        {member.name}
                      </p>
                      {member.role && (
                        <p className="text-[11px] uppercase tracking-[0.25em] text-rose-600">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </div>
                  {member.description && (
                    <p className="text-[11px] text-slate-600">
                      {member.description}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                    {years && (
                      <p>
                        <span className="font-semibold text-slate-800">
                          Experiencia:
                        </span>{' '}
                        {years} años
                      </p>
                    )}
                    {parsedSchedule ? (
                      <div>
                        <p>
                          <span className="font-semibold text-slate-800">
                            Horarios:
                          </span>
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {parsedSchedule.map((slot) => (
                            <li
                              key={slot.id}
                              className="text-[11px] text-slate-600"
                            >
                              {slot.label}: {slot.from} – {slot.to}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : member.schedule ? (
                      <p>
                        <span className="font-semibold text-slate-800">
                          Horarios:
                        </span>{' '}
                        {member.schedule}
                      </p>
                    ) : null}
                    {member.phone && (
                      <p>
                        <span className="font-semibold text-slate-800">
                          Teléfono:
                        </span>{' '}
                        {member.phone}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default About
