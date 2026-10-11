import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import type { ChapterSummary } from "@/app/lib/physics/types";

export default function ChapterPager({
  previous,
  next,
}: {
  previous: ChapterSummary | null;
  next: ChapterSummary | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Chapter navigation" className="pager">
      {previous ? (
        <Link
          href={`/physics/${previous.slug}`}
          className="brutal-card pager-link pager-prev"
          aria-disabled={previous.status !== "complete"}
        >
          <span className="pager-dir">
            {previous.status === "complete" ? (
              <ArrowLeft size={14} strokeWidth={2.5} />
            ) : (
              <Lock size={13} strokeWidth={2.5} />
            )}
            Previous
          </span>
          <span className="pager-title">
            {previous.number}. {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/physics/${next.slug}`}
          className="brutal-card pager-link pager-next"
          aria-disabled={next.status !== "complete"}
        >
          <span className="pager-dir">
            Next
            {next.status === "complete" ? (
              <ArrowRight size={14} strokeWidth={2.5} />
            ) : (
              <Lock size={13} strokeWidth={2.5} />
            )}
          </span>
          <span className="pager-title">
            {next.number}. {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
