import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDot, Clock, Target } from "lucide-react";
import { CHAPTERS } from "@/app/lib/physics/chapters";

export const metadata: Metadata = {
  title: "Physics Learning Platform",
  description:
    "An interactive physics course covering thirteen chapters, from units and dimensions to modern physics.",
};

const STATUS_COPY = {
  complete: "Ready to study",
  "in-progress": "In progress",
  planned: "Coming in Phase 2",
} as const;

export default function PhysicsIndexPage() {
  const completeCount = CHAPTERS.filter((chapter) => chapter.status === "complete").length;

  return (
    <div className="index">
      <header className="index-head">
        <p className="index-eyebrow">13 chapters · {completeCount} published</p>
        <h1 className="index-title">Physics Learning Platform</h1>
        <p className="index-lede">
          A complete, interactive rebuild of the course textbook. Every chapter pairs a
          visual summary with live dimensional analysis, worked examples that reveal one step at a
          time, and a quiz that explains every answer.
        </p>
      </header>

      <ol className="index-list">
        {CHAPTERS.map((chapter, position) => {
          const available = chapter.status === "complete";
          const href = `/physics/${chapter.slug}`;

          const body = (
            <>
              <div className="index-card-top">
                <span className="index-number">{chapter.number}</span>
                <span className={`index-status index-status-${chapter.status}`}>
                  <CircleDot size={12} strokeWidth={3} />
                  {STATUS_COPY[chapter.status]}
                </span>
              </div>

              <h2 className="index-card-title">{chapter.title}</h2>

              <ul className="index-objectives">
                {chapter.objectives.slice(0, 2).map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>

              <div className="index-card-foot">
                <span className="index-meta">
                  <Target size={14} strokeWidth={2.5} />
                  {chapter.objectives.length} objectives
                </span>
                {available && (
                  <span className="index-meta">
                    <Clock size={14} strokeWidth={2.5} />~{chapter.minutes} min
                  </span>
                )}
                <span className={`index-go ${available ? "" : "index-go-disabled"}`}>
                  {available ? "Start chapter" : "Locked"}
                  {available && <ArrowRight size={15} strokeWidth={2.5} />}
                </span>
              </div>
            </>
          );

          return (
            <li
              key={chapter.slug}
              className="index-item animate-fade-in-up"
              style={{ animationDelay: `${Math.min(position, 12) * 40}ms` }}
            >
              {available ? (
                <Link href={href} className="brutal-card index-card index-card-complete">
                  {body}
                </Link>
              ) : (
                <div className="brutal-card index-card index-card-planned">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
