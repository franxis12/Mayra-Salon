const services = [
  {
    title: 'Cabello',
    description:
      'Cortes, peinados y tratamientos diseñados para resaltar tu estilo y la salud de tu cabello.',
    items: ['Corte dama', 'Brushing y peinado', 'Keratina y botox capilar', 'Tratamientos hidratantes'],
  },
  {
    title: 'Color & Mechas',
    description:
      'Coloraciones personalizadas, mechas, baby lights y correcciones de color con productos profesionales.',
    items: ['Color completo', 'Mechas y reflejos', 'Balayage / babylights', 'Baño de color y brillo'],
  },
  {
    title: 'Manos & Pies',
    description:
      'Relaja tus manos y pies con un servicio prolijo y detallista en nuestro espacio de spa.',
    items: ['Manicure clásica', 'Pedicure spa', 'Esmaltado semipermanente', 'Spa de manos y pies'],
  },
  {
    title: 'Maquillaje',
    description:
      'Maquillaje social y para eventos especiales que acompaña tu estilo y tu ocasión.',
    items: ['Maquillaje social', 'Novias y quince', 'Pestañas individuales', 'Asesoría de imagen'],
  },
]

function Services() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
          servicios
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Un salón completo para mimarte de pies a cabeza.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
          Diseñamos cada servicio para que vivas un momento de relajación,
          confianza y resultados profesionales.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <section
            key={service.title}
            className="flex flex-col rounded-2xl border border-rose-100 bg-white/80 p-5 text-left shadow-sm shadow-rose-50"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {service.title}
              </h3>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                Agenda disponible
              </span>
            </div>
            <p className="text-sm text-slate-600">{service.description}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}

export default Services

