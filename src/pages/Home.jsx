import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr,1.1fr] md:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-rose-600">
            Mayra Salon
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Tu momento de cuidado,
            <span className="text-rose-600"> justo como lo mereces.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            En Mayra Salon combinamos técnicas profesionales con un ambiente
            cálido para que cada visita sea una experiencia de relajación,
            estilo y confianza. Cabello, manos y piel en manos expertas.
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
          <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/80 shadow-xl shadow-rose-100">
            <img
              src={heroImg}
              alt="Interior de Mayra Salon, un espacio acogedor de belleza"
              className="h-full w-full max-h-[520px] object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-100">
                  mayra salon
                </p>
                <p className="text-sm font-semibold">
                  Un lugar pensado para que te relajes y te mimen.
                </p>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-rose-700 backdrop-blur">
                ¡Te esperamos!
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
