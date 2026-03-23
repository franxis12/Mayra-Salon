const galleryItems = [
  {
    label: 'Peinados y recogidos',
    color: 'from-rose-300 via-rose-200 to-rose-100',
  },
  {
    label: 'Coloraciones y mechas',
    color: 'from-amber-300 via-amber-200 to-rose-100',
  },
  {
    label: 'Manos y uñas',
    color: 'from-pink-300 via-rose-200 to-rose-100',
  },
  {
    label: 'Novias y eventos',
    color: 'from-rose-400 via-rose-200 to-slate-100',
  },
  {
    label: 'Antes y después',
    color: 'from-rose-300 via-amber-200 to-slate-100',
  },
  {
    label: 'Detalles del salón',
    color: 'from-rose-200 via-slate-100 to-white',
  },
]

function Gallery() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
          galería
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Inspiración y resultados reales.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
          Un vistazo a algunos de nuestros trabajos, transformaciones y detalles
          del salón. Deja que las ideas fluyan para tu próxima visita.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {galleryItems.map((item) => (
          <article
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white/80 shadow-sm shadow-rose-50"
          >
            <div
              className={`aspect-[4/5] bg-gradient-to-br ${item.color} transition-transform duration-300 group-hover:scale-105`}
            />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm">
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p>Imágenes referenciales. Personalizamos cada look para ti.</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Gallery

