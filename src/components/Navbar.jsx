import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoMayra from "../assets/Images/Logo Mayra.png";
import settingsIcon from "../assets/icons/settings.png";

const navLinkBase =
  "text-sm font-medium tracking-wide transition-colors px-3 py-2 rounded-full";

const getNavLinkClass = ({ isActive }) =>
  [
    navLinkBase,
    isActive
      ? "bg-rose-600 text-white shadow-sm"
      : "text-slate-700 hover:bg-rose-50 hover:text-rose-700",
  ].join(" ");

function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName =
    (profile?.full_name && profile.full_name.trim()) ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "");

  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm">
            <img src={logoMayra}></img>
          </div>
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-semibold tracking-wide text-slate-900">
              D'Mayra Salon
            </p>
            <p className="text-xs text-slate-500">&amp; Beauty Supply</p>
          </div>
        </NavLink>

        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/store" className={getNavLinkClass}>
            Store
          </NavLink>
          <NavLink to="/services" className={getNavLinkClass}>
            Services
          </NavLink>
          <NavLink to="/gallery" className={getNavLinkClass}>
            Gallery
          </NavLink>
        </div>

        <div className="relative flex items-center gap-2">
          {user && (
            <span className="hidden text-xs font-semibold text-slate-700 md:inline">
              Welcome{displayName ? `, ${displayName}` : ""}.
            </span>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full  text-slate-600 shadow-sm hover:border-rose-300 hover:bg-rose-50"
            aria-label="Open user menu"
          >
            <img
              src={settingsIcon}
              alt="Settings"
              className="h-8 w-8 object-contain"
            />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-rose-100 bg-white/95 p-2 text-xs text-slate-700 shadow-lg">
              <ul className="mt-1 space-y-1">
                {user ? (
                  <>
                    <li>
                      <NavLink
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-2 py-1.5 hover:bg-rose-50"
                      >
                        My account
                      </NavLink>
                    </li>
                    {isAdmin && (
                      <li>
                        <NavLink
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-2 py-1.5 hover:bg-rose-50"
                        >
                          Admin panel
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                        }}
                        className="block w-full rounded-xl px-2 py-1.5 text-left text-rose-600 hover:bg-rose-50"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-2 py-1.5 hover:bg-rose-50"
                    >
                      Sign in / Create account
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
