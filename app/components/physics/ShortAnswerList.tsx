"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ShortAnswer } from "@/app/lib/physics/types";

export default function ShortAnswerList({
  heading,
  items,
}: {
  heading: string;
  items: ShortAnswer[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="short-answer">
      <h3 className="examples-heading">{heading}</h3>
      <ol className="short-answer-list">
        {items.map((item, index) => {
          const isOpen = open[item.id] ?? false;
          return (
            <li key={item.id} className="short-answer-item">
              <button
                type="button"
                onClick={() => setOpen((current) => ({ ...current, [item.id]: !isOpen }))}
                aria-expanded={isOpen}
                className="short-answer-toggle"
              >
                <span className="short-answer-index">{index + 1}</span>
                <span className="short-answer-question">{item.question}</span>
                <ChevronDown
                  size={18}
                  strokeWidth={2.5}
                  className={`short-answer-caret ${isOpen ? "short-answer-caret-open" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="short-answer-body animate-fade-in-up">
                  <span className="short-answer-tag">Model answer</span>
                  <p>{item.answer}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
