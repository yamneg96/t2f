import type React from "react";
import { Link, useLocation } from "react-router-dom";

const sideLinks = [
  { icon: "dashboard", label: "Dashboard", path: "/editor" },
  { icon: "code", label: "Code Editor", path: "/editor" },
  { icon: "history", label: "History", path: "/history" },
  { icon: "terminal", label: "API Logs", path: "#" },
  { icon: "shield", label: "Security", path: "#" },
  { icon: "analytics", label: "Analytics", path: "#" },
];

const iconPaths: Record<string, React.ReactNode> = {
  dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
  code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
  history: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  terminal: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
  analytics: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
};

export function SideNavBar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col h-full py-4 bg-[var(--sm-surface-container-low)] border-r border-[var(--sm-outline-variant)]/20 w-64 shrink-0">
      {/* Project info */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-[var(--sm-surface-container)] rounded-lg border border-[var(--sm-outline-variant)]/10">
          <div className="w-10 h-10 bg-[var(--sm-primary)]/10 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--sm-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {iconPaths.terminal}
            </svg>
          </div>
          <div>
            <div className="font-label text-xs font-bold text-[var(--sm-on-surface)]">
              Project Alpha
            </div>
            <div className="font-label text-[10px] text-[var(--sm-outline)]">
              v2.4.0-stable
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)] px-3 mb-2">
          Main Environment
        </div>
        {sideLinks.map((link) => {
          const isActive = location.pathname === link.path && link.path !== "#";
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 font-label text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-[var(--sm-surface-container-high)] text-[var(--sm-primary)] border-l-2 border-[var(--sm-primary)]"
                  : "text-[var(--sm-on-surface)]/50 hover:bg-[var(--sm-surface-container)] hover:text-[var(--sm-on-surface)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {iconPaths[link.icon]}
              </svg>
              {link.label}
            </Link>
          );
        })}
        <div className="pt-6">
          <button className="w-full code-gradient text-[var(--sm-on-primary)] py-2 rounded font-label text-xs font-bold shadow-lg shadow-[var(--sm-primary)]/10">
            New Deploy
          </button>
        </div>
      </nav>

      {/* Bottom links */}
      <div className="px-3 border-t border-[var(--sm-outline-variant)]/10 pt-4 mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-[var(--sm-on-surface)]/50 hover:text-[var(--sm-on-surface)] font-label text-xs font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Docs
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-[var(--sm-on-surface)]/50 hover:text-[var(--sm-on-surface)] font-label text-xs font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          Support
        </a>
      </div>
    </aside>
  );
}
