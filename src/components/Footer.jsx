import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-12 border-t border-rose-100 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 md:space-y-0">
          <p>© {new Date().getFullYear()} Mayra Salon. All rights reserved.</p>
          <p className="mt-1 flex flex-wrap items-center gap-2 md:mt-0">
            <span>Mon - Sat · 9:00am - 7:00pm</span>
            <span className="hidden md:inline">·</span>
            <span>Tel: (555) 123-4567</span>
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-[11px] md:justify-end">
          <Link
            to="/about"
            className="underline-offset-4 hover:text-rose-700 hover:underline"
          >
            About
          </Link>
          <span className="hidden md:inline">·</span>
          <Link
            to="/contact"
            className="underline-offset-4 hover:text-rose-700 hover:underline"
          >
            Contact
          </Link>
          <span className="hidden md:inline">·</span>
          <Link
            to="/privacy"
            className="underline-offset-4 hover:text-rose-700 hover:underline"
          >
            Privacy policy
          </Link>
          <span className="hidden md:inline">·</span>
          <Link
            to="/terms"
            className="underline-offset-4 hover:text-rose-700 hover:underline"
          >
            Terms of use
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
