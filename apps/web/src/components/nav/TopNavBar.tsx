import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const navLinks = [
  { label: "Import", path: "/editor" },
  { label: "History", path: "/history" },
  { label: "Settings", path: "/settings" },
  { label: "Pricing", path: "/pricing" },
];

export function TopNavBar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 bg-[var(--sm-surface)] border-b border-[var(--sm-outline-variant)]/20 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter text-[var(--sm-on-surface)] uppercase font-label"
        >
          T2F
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-label text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "text-[var(--sm-primary)] border-b-2 border-[var(--sm-primary)] pb-1"
                    : "text-[var(--sm-on-surface)]/60 hover:text-[var(--sm-on-surface)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-[var(--sm-on-surface)]/60 hover:bg-[var(--sm-surface-container-high)] transition-all duration-200 rounded-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
          <button className="p-2 text-[var(--sm-on-surface)]/60 hover:bg-[var(--sm-surface-container-high)] transition-all duration-200 rounded-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </button>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--sm-surface-container-high)] border border-[var(--sm-outline-variant)]/30 flex items-center justify-center text-xs font-bold font-label text-[var(--sm-primary)]">
              {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <button
              onClick={logout}
              className="text-xs font-label text-[var(--sm-on-surface-variant)] hover:text-[var(--sm-error)] transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-xs font-label font-bold text-[var(--sm-on-surface)] hover:text-[var(--sm-primary)] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 code-gradient text-[var(--sm-on-primary)] text-xs font-label font-bold rounded-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
