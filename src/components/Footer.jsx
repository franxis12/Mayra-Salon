function Footer() {
  return (
    <footer className="mt-12 border-t border-rose-100 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Mayra Salon. Todos los derechos reservados.</p>
        <p className="flex gap-2">
          <span>Lun - Sáb · 9:00am - 7:00pm</span>
          <span className="hidden md:inline">·</span>
          <span>Tel: (555) 123-4567</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer

