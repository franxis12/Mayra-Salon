function Contact() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.1fr,1fr] md:items-start">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            reservas
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Agenda tu próxima visita.
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Completa el formulario y nos pondremos en contacto para confirmar tu
            turno. También puedes escribirnos por WhatsApp o llamarnos al salón.
          </p>

          <form
            className="mt-4 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault()
              alert('¡Gracias por escribirnos! Te contactaremos para confirmar tu cita.')
            }}
          >
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
                <label htmlFor="phone" className="font-medium text-slate-800">
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ej: (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 text-xs">
                <label htmlFor="date" className="font-medium text-slate-800">
                  Fecha preferida
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label htmlFor="time" className="font-medium text-slate-800">
                  Horario aproximado
                </label>
                <input
                  id="time"
                  type="time"
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="service" className="font-medium text-slate-800">
                Servicio que te interesa
              </label>
              <select
                id="service"
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 focus:ring"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option>Cabello</option>
                <option>Color &amp; mechas</option>
                <option>Manos &amp; pies</option>
                <option>Maquillaje</option>
                <option>Consulta general</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="message" className="font-medium text-slate-800">
                Comentarios o detalles
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Cuéntanos qué te gustaría hacerte o si tienes alguna referencia."
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 md:w-auto"
            >
              Enviar consulta
            </button>
          </form>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Información de contacto
          </h3>
          <p>
            <span className="font-semibold">Dirección:</span>{' '}
            Calle Principal 123, Ciudad
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> (555) 123-4567
          </p>
          <p>
            <span className="font-semibold">WhatsApp:</span> +1 (555) 987-6543
          </p>
          <p>
            <span className="font-semibold">Horario:</span> Lunes a sábado de
            9:00am a 7:00pm
          </p>
        </section>
      </div>
    </main>
  )
}

export default Contact

