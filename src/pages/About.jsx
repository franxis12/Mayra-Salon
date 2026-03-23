function About() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-start">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            nosotras
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Un equipo que ama cuidar de ti.
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Mayra Salon nació del deseo de crear un espacio femenino, cálido y
            profesional donde cada clienta se sienta escuchada y acompañada. Nos
            enfocamos en escucharte y aconsejarte para encontrar el estilo que
            mejor resalta tu esencia.
          </p>
          <p className="text-sm text-slate-600 md:text-base">
            Trabajamos con productos seleccionados y nos capacitamos
            constantemente para ofrecerte las últimas tendencias en coloración,
            cortes y cuidado integral.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Mayra</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                estilista &amp; colorista
              </p>
              <p>
                Especialista en coloración, mechas y cambios de imagen. Su
                objetivo es que te vayas del salón sintiéndote renovada.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 text-xs text-slate-700 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Equipo Mayra</p>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rose-600">
                manicuristas &amp; maquillaje
              </p>
              <p>
                Un equipo atento a cada detalle, desde tus manos y pies hasta el
                look perfecto para tu evento especial.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Nuestro espacio
          </h3>
          <p>
            Luz cálida, aromas suaves, música relajante y una atención cercana.
            Buscamos que tu cita sea un momento de pausa en tu rutina.
          </p>
          <ul className="space-y-2 text-xs">
            <li>• Ubicación céntrica con fácil acceso.</li>
            <li>• Ambiente íntimo y acogedor, pensado para pocas clientas a la vez.</li>
            <li>• Área de manicure y pedicure tipo spa.</li>
            <li>• Estaciones de peinado cómodas y luminosas.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}

export default About

