"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/app/lib/physics/types";

/**
 * Sticky in-chapter outline with scroll spy. Uses IntersectionObserver rather
 * than scroll maths so it stays cheap on long chapters.
 */
export default function ChapterOutline({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Bias the trigger line towards the upper third of the viewport so a
      // heading becomes "current" while its content is still comfortably on screen.
      { rootMargin: "-72px 0px -66% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="On this page" className="outline">
      <p className="outline-label">On this page</p>
      <ol className="outline-list">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`outline-link ${activeId === section.id ? "outline-link-active" : ""}`}
              aria-current={activeId === section.id ? "location" : undefined}
            >
              <span className="outline-number">{section.number}</span>
              <span className="outline-title">{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
