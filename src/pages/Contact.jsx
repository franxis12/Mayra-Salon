function Contact() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <section className="space-y-4 rounded-3xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm shadow-rose-100 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
          contact
        </p>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Visit us or get in touch with the salon.
        </h2>
        <p className="text-xs text-slate-600 md:text-sm">
          The owner prefers to manage appointments personally by phone or in
          person at the salon. Use the following details if you have questions
          about services, prices or product availability.
        </p>

        <div className="mt-4 grid gap-6 text-xs text-slate-700 md:grid-cols-3 md:text-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Salon address
            </h3>
            <p>
              1022 Broad St
              <br />
              Providence, RI 02905
              <br />
              United States
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Phone &amp; WhatsApp
            </h3>
            <p>
              Phone: <span className="font-semibold">(555) 123-4567</span>
              <br />
              WhatsApp: <span className="font-semibold">+1 (555) 987-6543</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Call or send a message to coordinate your visit directly with the
              salon.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">Hours</h3>
            <p>
              Monday to Saturday
              <br />
              <span className="font-semibold">9:00am – 7:00pm</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;

