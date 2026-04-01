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
          'Connect Supabase to show the team dynamically.',
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
        setError(dbError.message ?? 'We could not load the team.')
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
            about us
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            A team that loves taking care of you.
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            D&apos;Mayra Salon was born from the desire to create a feminine,
            warm and professional space where every client feels heard and
            supported. We focus on listening to you and advising you to find the
            style that best highlights your essence.
          </p>
          <p className="text-sm text-slate-600 md:text-base">
            We work with selected products and constantly train to offer you the
            latest trends in color, cuts and overall care.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Mayra</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                stylist &amp; colorist
              </p>
              <p>
                Specialist in color, highlights and image changes. Her goal is
                that you leave the salon feeling renewed.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Mayra team</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                manicure &amp; makeup
              </p>
              <p>
                A team attentive to every detail, from your hands and feet to
                the perfect look for your special event.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Our space
          </h3>
          <p>
            Warm light, soft aromas, relaxing music and close attention. We want
            your appointment to be a pause in your routine.
          </p>
          <ul className="space-y-2 text-xs">
            <li>• Central location with easy access.</li>
            <li>• Intimate, cozy atmosphere designed for a few clients at a time.</li>
            <li>• Spa-like manicure and pedicure area.</li>
            <li>• Comfortable, bright styling stations.</li>
          </ul>
        </section>
      </div>

      <section className="mt-10 space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            team
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Meet the people who take care of you.
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
            Each team member has their own style and specialty. Here you can see
            their schedules, experience and how to contact them.
          </p>
        </div>

        {loading && (
          <p className="text-center text-xs text-slate-600">
            Loading team...
          </p>
        )}
        {error && !loading && (
          <p className="mx-auto max-w-xl rounded-2xl bg-rose-50 px-4 py-3 text-center text-xs text-rose-700">
            {error}
          </p>
        )}
        {!loading && !error && team.length === 0 && (
          <p className="text-center text-xs text-slate-600">
            There are no team members yet. You can add them from the admin
            panel.
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
                          Experience:
                        </span>{' '}
                        {years} years
                      </p>
                    )}
                    {parsedSchedule ? (
                      <div>
                        <p>
                          <span className="font-semibold text-slate-800">
                            Hours:
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
                          Hours:
                        </span>{' '}
                        {member.schedule}
                      </p>
                    ) : null}
                    {member.phone && (
                      <p>
                        <span className="font-semibold text-slate-800">
                          Phone:
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
