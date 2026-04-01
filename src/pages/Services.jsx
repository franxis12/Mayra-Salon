const services = [
  {
    title: 'Hair',
    description:
      'Cuts, blowouts and treatments designed to highlight your style and keep your hair healthy.',
    items: ['Women haircut', 'Blowout & styling', 'Keratin / botox treatment', 'Deep moisturizing treatments'],
  },
  {
    title: 'Color & Highlights',
    description:
      'Custom color, highlights, baby lights and color corrections with professional products.',
    items: ['Full color', 'Highlights & lowlights', 'Balayage / babylights', 'Gloss / shine treatment'],
  },
  {
    title: 'Hands & Feet',
    description:
      'Relax your hands and feet with detailed services in our spa area.',
    items: ['Classic manicure', 'Spa pedicure', 'Gel / long-lasting polish', 'Hands & feet spa'],
  },
  {
    title: 'Makeup',
    description:
      'Social and event makeup that fits your style and occasion.',
    items: ['Event makeup', 'Bridal & quinceanera', 'Individual lashes', 'Image / style consultation'],
  },
]

function Services() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
          services
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          A full-service salon to pamper you from head to toe.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
          Every service is designed so you can experience relaxation, confidence
          and professional results.
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
                Availability
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
