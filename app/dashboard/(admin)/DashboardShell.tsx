"use client";

import {
  Briefcase,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "../../actions/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  { href: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
  { href: "/dashboard/social", label: "Social links", icon: ExternalLink },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-theme bg-card">
        <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold text-theme"
          >
            <Sparkles size={18} />
            <span>ehabo._.o</span>
            <span className="text-theme-muted text-sm font-semibold">
              / dashboard
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="text-sm font-semibold text-theme-muted hover:text-theme flex items-center gap-1.5"
            >
              view site
              <ExternalLink size={14} />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="brutal-btn text-sm"
                style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
              >
                <LogOut size={14} />
                sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        <nav className="md:w-52 shrink-0">
          <ul className="flex md:flex-col gap-2">
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-4 py-2.5 border-[3px] text-sm font-bold transition-colors ${
                      active
                        ? "bg-accent-highlight text-black border-theme"
                        : "bg-card text-theme-muted border-transparent hover:border-theme hover:text-theme"
                    }`}
                    style={
                      active
                        ? { boxShadow: "3px 3px 0px 0px var(--shadow-color)" }
                        : undefined
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}