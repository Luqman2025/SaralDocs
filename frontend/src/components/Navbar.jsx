import React, { useState } from "react";
import { FileText, Sparkles, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onReset }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ added

  const links = [
    { label: "Home", path: "/" },
    { label: "How it works", path: "/how-it-works" },
    { label: "Supported Docs", path: "/supported-docs" },
    { label: "Privacy", path: "/privacy" },
  ];

  const handleHomeClick = () => {
    navigate("/");
    onReset(); // reset state when going home
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO → HOME */}
          <button onClick={handleHomeClick} className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-tactile transition-transform group-hover:-translate-y-0.5">
              <FileText className="h-5 w-5" strokeWidth={2.2} />
            </span>

            <div className="flex flex-col leading-none text-left">
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                Saral Docs
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Legal · Simplified
              </span>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = location.pathname === l.path; // ✅ active check

              return (
                <Link
                  key={l.label}
                  to={l.path}
                  className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors
                    ${isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"}
                  `}
                >
                  {l.label}

                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px bg-foreground transition-transform duration-300
                      ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                    `}
                  />
                </Link>
              );
            })}

            {/* TRY DEMO */}
            <button
              onClick={handleHomeClick}
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              Upload & Analyze
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* MOBILE NAV */}
        {open && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2">

              {links.map((l) => {
                const isActive = location.pathname === l.path; // ✅ active check

                return (
                  <Link
                    key={l.label}
                    to={l.path}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors
                      ${isActive ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary"}
                    `}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                );
              })}

              {/* TRY DEMO (mobile) */}
              <button
                onClick={handleHomeClick}
                className="rounded-lg px-3 py-2 text-sm text-primary hover:bg-secondary"
              >
                Try Demo
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}