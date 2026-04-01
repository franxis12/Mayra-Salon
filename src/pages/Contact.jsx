function Contact() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.1fr,1fr] md:items-start">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            appointments
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Book your next visit.
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Fill out the form and we&apos;ll contact you to confirm your
            appointment. You can also write to us via WhatsApp or call the
            salon.
          </p>

          <form
            className="mt-4 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault()
              alert(
                'Thank you for writing to us! We will contact you to confirm your appointment.',
              )
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 text-xs">
                <label htmlFor="name" className="font-medium text-slate-800">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: Mayra Gonzalez"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label htmlFor="phone" className="font-medium text-slate-800">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 text-xs">
                <label htmlFor="date" className="font-medium text-slate-800">
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label htmlFor="time" className="font-medium text-slate-800">
                  Approximate time
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
                Service you&apos;re interested in
              </label>
              <select
                id="service"
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 focus:ring"
                defaultValue=""
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>Hair</option>
                <option>Color &amp; highlights</option>
                <option>Hands &amp; feet</option>
                <option>Makeup</option>
                <option>General consultation</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="message" className="font-medium text-slate-800">
                Comments or details
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Tell us what you would like to do or if you have any reference images."
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 md:w-auto"
            >
              Send request
            </button>
          </form>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Contact information
          </h3>
          <p>
            <span className="font-semibold">Address:</span>{' '}
            1022 Broad St, Providence, RI 02905
          </p>
          <p>
            <span className="font-semibold">Phone:</span> (555) 123-4567
          </p>
          <p>
            <span className="font-semibold">WhatsApp:</span> +1 (555) 987-6543
          </p>
          <p>
            <span className="font-semibold">Hours:</span> Monday to Saturday
            from 9:00am to 7:00pm
          </p>
        </section>
      </div>
    </main>
  )
}

export default Contact
