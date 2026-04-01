const galleryItems = [
  {
    label: 'Hairstyles & updos',
    color: 'from-rose-300 via-rose-200 to-rose-100',
  },
  {
    label: 'Color and highlights',
    color: 'from-amber-300 via-amber-200 to-rose-100',
  },
  {
    label: 'Hands & nails',
    color: 'from-pink-300 via-rose-200 to-rose-100',
  },
  {
    label: 'Brides & events',
    color: 'from-rose-400 via-rose-200 to-slate-100',
  },
  {
    label: 'Before & after',
    color: 'from-rose-300 via-amber-200 to-slate-100',
  },
  {
    label: 'Salon details',
    color: 'from-rose-200 via-slate-100 to-white',
  },
]

function Gallery() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
          gallery
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Inspiration and real results.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
          A look at some of our work, transformations and details of the salon.
          Let ideas flow for your next visit.
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
              <p>Sample images. We personalize each look just for you.</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Gallery
