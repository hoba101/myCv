"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, Menu, X } from "lucide-react";
import { CHAPTERS } from "@/app/lib/physics/chapters";
import type { ChapterStatus } from "@/app/lib/physics/types";

const STATUS_STYLES: Record<ChapterStatus, string> = {
  complete: "bg-accent-green",
  "in-progress": "bg-accent-highlight",
  planned: "bg-theme-muted",
};

const STATUS_LABEL: Record<ChapterStatus, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  planned: "Planned",
};

export default function ChapterNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeSlug = pathname?.startsWith("/physics/") ? pathname.split("/")[2] : undefined;
  const currentTitle = CHAPTERS.find((chapter) => chapter.slug === activeSlug)?.shortTitle;

  // Lock body scroll while the drawer covers the viewport.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="physics-topbar">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="physics-icon-btn lg:hidden"
          aria-label="Open chapter list"
          aria-expanded={open}
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>
        <span className="physics-topbar-title">{currentTitle ?? "Physics"}</span>      </header>

      {open && (
        <button
          type="button"
          className="physics-scrim"
          aria-label="Close chapter list"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`physics-sidebar ${open ? "physics-sidebar-open" : ""}`}>
        <div className="physics-sidebar-head">
          <Link href="/physics" onClick={() => setOpen(false)} className="physics-brand">
            <BookOpen size={20} strokeWidth={2.5} />
            <span>
              <span className="physics-brand-title">Physics</span>
              <span className="physics-brand-sub">Learning Platform</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="physics-icon-btn lg:hidden"
            aria-label="Close chapter list"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <nav aria-label="Chapters" className="physics-nav">
          <p className="physics-nav-label">Chapters</p>
          <ol className="physics-nav-list">
            {CHAPTERS.map((chapter) => {
              const href = `/physics/${chapter.slug}`;
              const active = pathname === href;

              return (
                <li key={chapter.slug}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`physics-nav-item ${active ? "physics-nav-item-active" : ""} ${
                      chapter.status === "planned" ? "physics-nav-item-planned" : ""
                    }`}
                  >
                    <span className="physics-nav-number">{chapter.number}</span>
                    <span className="physics-nav-text">
                      <span className="physics-nav-title">{chapter.shortTitle}</span>
                      <span className="physics-nav-status">
                        <span
                          className={`physics-dot ${STATUS_STYLES[chapter.status]}`}
                          aria-hidden="true"
                        />
                        {STATUS_LABEL[chapter.status]}
                        {chapter.status === "complete" && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="physics-sidebar-foot">
          <Link href="/" className="physics-back-link">
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to portfolio
          </Link>
        </div>
      </aside>
    </>
  );
}
