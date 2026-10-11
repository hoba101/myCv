"use client";

import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "about", href: "#hero" },
  { label: "services", href: "#services" },
  { label: "projects", href: "#projects" },
  { label: "hire me", href: "#contact" },
];

const emptySubscribe = () => () => {};

export default function Navbar({
  handle,
  logoUrl,
}: {
  handle: string;
  logoUrl?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inDashboard = pathname?.startsWith("/dashboard");

  return (
    <div
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-6 pointer-events-none"
    >
      <nav
        className={`mx-auto max-w-fit border-[3px] border-theme bg-card transition-all duration-500 pointer-events-auto ${
          scrolled ? "rounded-2xl px-4 py-2 md:px-5" : "rounded-full px-5 py-2.5"
        }`}
        style={{
          boxShadow: scrolled ? "4px 4px 0px 0px var(--shadow-color)" : "3px 3px 0px 0px var(--shadow-color)",
          transform: scrolled ? "translateY(0)" : "translateY(0)",
        }}
      >
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href={inDashboard ? "/dashboard" : "#hero"}
            className="flex items-center gap-2 text-lg font-bold text-theme transition-opacity hover:opacity-80"
          >
            <Logo handle={handle} logoUrl={logoUrl} size={18} />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link group relative text-sm font-semibold text-theme-muted transition-colors hover:text-theme"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-accent-highlight transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center rounded-full p-1.5 text-theme transition-opacity hover:opacity-80"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            ) : null}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-theme focus:outline-none md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={2.5} />
              ) : (
                <Menu size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* scroll progress */}
      <ScrollProgress />

      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="pointer-events-auto mx-auto mt-2 max-w-[200px] animate-fade-in-up rounded-2xl border-[3px] border-theme bg-card p-4"
          style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}
        >
          <div className="flex flex-col gap-3 text-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-theme-muted transition-colors hover:text-theme"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const width = useSyncExternalStore(
    emptySubscribe,
    () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      return max > 0 ? (doc.scrollTop / max) * 100 : 0;
    },
    () => 0
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="mx-auto mt-2 h-[3px] max-w-3xl overflow-hidden rounded-full bg-card/40"
    >
      <div
        className="h-full rounded-full bg-accent-highlight transition-[width] duration-150"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}