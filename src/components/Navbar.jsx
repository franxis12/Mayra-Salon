import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoMayra from "../assets/Images/Logo Mayra.png";

const navLinkBase =
  "text-sm font-medium tracking-wide transition-colors px-3 py-2 rounded-full";

const getNavLinkClass = ({ isActive }) =>
  [
    navLinkBase,
    isActive
      ? "bg-rose-600 text-white shadow-sm"
      : "text-slate-700 hover:bg-rose-50 hover:text-rose-700",
  ].join(" ");
//no test
function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm">
            <img src={logoMayra}></img>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-slate-900">
              D'Mayra Salon
            </p>
            <p className="text-xs text-slate-500">&amp; Beauty Supply</p>
          </div>
        </NavLink>

        <div className="hidden gap-2 md:flex">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={getNavLinkClass}>
            Services
          </NavLink>
          <NavLink to="/store" className={getNavLinkClass}>
            Store
          </NavLink>
          <NavLink to="/gallery" className={getNavLinkClass}>
            Gallery
          </NavLink>
          <NavLink to="/about" className={getNavLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={getNavLinkClass}>
            Contact
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <NavLink
              to="/dashboard"
              className="hidden rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 md:inline-flex"
            >
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="hidden text-xs font-semibold text-slate-600 underline-offset-4 hover:underline md:inline-block"
              >
                My account
              </NavLink>
              <button
                type="button"
                onClick={signOut}
                className="hidden text-xs font-semibold text-slate-600 underline-offset-4 hover:underline md:inline-block"
              >
                Sign out
              </button>
              <NavLink
                to="/contact"
                className="inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 md:px-5"
              >
                Book an appointment
              </NavLink>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-xs font-semibold text-slate-600 underline-offset-4 hover:underline md:inline-block"
              >
                Sign in
              </Link>
              <NavLink
                to="/contact"
                className="inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 md:px-5"
              >
                Book an appointment
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
