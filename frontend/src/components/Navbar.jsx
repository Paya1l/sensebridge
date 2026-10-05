import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bridge } from "./Logo";
import { Contrast } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/sound-alerts", label: "Sound Alerts" },
  { to: "/extension", label: "Extension" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
  { to: "/ai-vision", label: "AI Vision" },
];

export default function Navbar() {
  const loc = useLocation();
  const { prefs, set } = useAccessibility();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[var(--sb-border)]" data-testid="navbar">
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" data-testid="logo-link" aria-label="SenseBridge home">
          <Bridge className="w-9 h-9" />
          <span className="text-[22px] font-extrabold tracking-tight">
            Sense<span className="text-[var(--sb-purple)]">Bridge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map(l => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-300 ${
                  active
                    ? "text-[var(--sb-purple)] bg-[var(--sb-lavender)]"
                    : "text-[var(--sb-text-soft)] hover:text-[var(--sb-purple)] hover:bg-[var(--sb-lavender)]/60"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-testid="toggle-contrast"
            onClick={() => set({ highContrast: !prefs.highContrast })}
            className="w-11 h-11 rounded-full border border-[var(--sb-border)] flex items-center justify-center hover:bg-[var(--sb-lavender)] transition-colors"
            aria-label="Toggle high contrast"
            aria-pressed={prefs.highContrast}
          >
            <Contrast className="w-5 h-5 text-[var(--sb-text)]" aria-hidden />
          </button>
          <Link
            to="/tools"
            data-testid="cta-try-live"
            className="hidden sm:inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold transition-all hover:gap-3"
          >
            Get Started <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}