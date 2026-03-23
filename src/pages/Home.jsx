import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-rose-600">
            salón de belleza · mayra
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Tu momento de cuidado,
            <span className="text-rose-600"> justo como lo mereces.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            En Mayra Salon combinamos técnicas profesionales con un ambiente cálido
            para que cada visita sea una experiencia de relajación, estilo y
            confianza. Cabello, manos y piel en manos expertas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="inline-flex items-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Reservar cita
            </Link>
            <Link
              to="/servicios"
              className="inline-flex items-center rounded-full border border-rose-200 bg-white px-6 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Ver servicios
            </Link>
          </div>

          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 text-xs text-slate-600 md:text-sm">
            <div>
              <dt className="font-semibold text-slate-900">+10 años</dt>
              <dd>de experiencia en belleza y cuidado.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Productos pro</dt>
              <dd>marcas profesionales y tratamientos personalizados.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Ambiente único</dt>
              <dd>relajante, femenino y acogedor.</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-rose-100 via-rose-50 to-amber-50 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-white/80 p-4 shadow-lg shadow-rose-100">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-t from-rose-200 via-rose-100 to-white">
              <div className="flex h-full flex-col justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
                    agenda tu cita
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Transformaciones que resaltan tu belleza natural.
                  </p>
                </div>
                <div className="space-y-3 text-xs text-slate-700">
                  <p>• Cortes y peinados personalizados</p>
                  <p>• Coloración, mechas y tratamientos</p>
                  <p>• Manicure, pedicure y spa de manos</p>
                  <p>• Maquillaje profesional para eventos</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Próximo sábado · 10:00am
                  </p>
                  <p>Últimos espacios disponibles para coloración y peinado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home

