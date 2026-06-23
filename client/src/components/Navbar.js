import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", file: "home.jsx" },
  { to: "/articles-list", label: "Articles", file: "articles.jsx" },
  { to: "/about", label: "About", file: "about.md" },
];

const MenuIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink text-amber font-mono text-sm font-semibold">
              {"</>"}
            </span>
            <span className="font-display font-semibold text-lg text-ink tracking-tight">
              SaMu<span className="text-amber">Tech</span>
            </span>
          </Link>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-stretch h-16">
            {tabs.map((tab) => {
              const active = isActive(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative flex flex-col items-start justify-center px-5 border-l border-border first:border-l-0 transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${active ? "bg-teal" : "bg-border"}`}
                    />
                    {tab.label}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{tab.file}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <a
              href="#subscribe"
              className="inline-flex items-center rounded-full bg-amber px-5 py-2 text-sm font-semibold text-white hover:bg-amber-light transition-colors"
            >
              Subscribe
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-white">
          <ul className="px-4 py-2">
            {tabs.map((tab) => {
              const active = isActive(tab.to);
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-3 border-b border-border last:border-b-0 ${
                      active ? "text-ink font-semibold" : "text-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-teal" : "bg-border"}`} />
                      {tab.label}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{tab.file}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-4 pb-4">
            <a
              href="#subscribe"
              onClick={() => setOpen(false)}
              className="block text-center rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white"
            >
              Subscribe
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
