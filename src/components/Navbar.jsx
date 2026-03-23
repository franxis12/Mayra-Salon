import { NavLink } from 'react-router-dom'

const navLinkBase =
  'text-sm font-medium tracking-wide transition-colors px-3 py-2 rounded-full'

const getNavLinkClass = ({ isActive }) =>
  [
    navLinkBase,
    isActive
      ? 'bg-rose-600 text-white shadow-sm'
      : 'text-slate-700 hover:bg-rose-50 hover:text-rose-700',
  ].join(' ')

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
            <span className="text-lg font-semibold">M</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-slate-900">
              Mayra Salon
            </p>
            <p className="text-xs text-slate-500">
              Belleza &amp; cuidado personalizado
            </p>
          </div>
        </NavLink>

        <div className="hidden gap-2 md:flex">
          <NavLink to="/" className={getNavLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/servicios" className={getNavLinkClass}>
            Servicios
          </NavLink>
          <NavLink to="/galeria" className={getNavLinkClass}>
            Galería
          </NavLink>
          <NavLink to="/nosotras" className={getNavLinkClass}>
            Nosotras
          </NavLink>
          <NavLink to="/contacto" className={getNavLinkClass}>
            Contacto
          </NavLink>
        </div>

        <NavLink
          to="/contacto"
          className="inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 md:px-5"
        >
          Reserva tu cita
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar

