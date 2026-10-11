/**
 * ============================================
 * NAVBAR COMPONENT
 * ============================================
 * Floating pill-shaped navigation with dark
 * mode toggle.
 */

"use client";

import { Sparkles, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { label: "about", href: "#hero" },
  { label: "services", href: "#services" },
  { label: "projects", href: "#projects" },
  { label: "hire me", href: "#contact" },
];

const emptySubscribe = () => () => {};

export default function Navbar({ handle }: { handle: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className="mx-auto max-w-fit bg-card border-[3px] border-theme rounded-full pointer-events-auto" style={{ boxShadow: '3px 3px 0px 0px var(--shadow-color)' }}>
        <div className="px-5 py-2.5 flex items-center gap-6 md:gap-10">
          {/* --- Logo --- */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-lg font-bold text-theme hover:opacity-80 transition-opacity"
          >
            <Sparkles size={18} />
            <span>{handle}</span>
          </a>

          {/* --- Desktop Links --- */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-theme-muted hover:text-theme transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* --- Theme Toggle & Mobile Menu --- */}
          <div className="flex items-center gap-2 md:gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-theme hover:opacity-80 transition-opacity flex items-center justify-center p-1.5 rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* --- Mobile Toggle --- */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-theme focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      {mobileOpen && (
        <div className="md:hidden mx-auto mt-2 max-w-[200px] bg-card border-[3px] border-theme rounded-2xl p-4 pointer-events-auto animate-fade-in-up" style={{ boxShadow: '3px 3px 0px 0px var(--shadow-color)' }}>
          <div className="flex flex-col gap-3 text-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-theme-muted hover:text-theme transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
