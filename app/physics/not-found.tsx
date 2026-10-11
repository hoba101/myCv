import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CHAPTERS } from "@/app/lib/physics/chapters";

export default function PhysicsNotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h1 className="not-found-title">That chapter does not exist</h1>
      <p className="not-found-text">
        The chapter you asked for is not part of this textbook. It may still be scheduled for a
        later phase of the build.
      </p>

      <ul className="not-found-list">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.slug}>
            <span className="not-found-number">{chapter.number}</span>
            <span className="not-found-title-sm">{chapter.title}</span>
            <span className="not-found-status">{chapter.status.replace("-", " ")}</span>
          </li>
        ))}
      </ul>

      <Link href="/physics" className="brutal-btn brutal-btn-primary">
        <ArrowLeft size={15} strokeWidth={2.5} />
        Back to all chapters
      </Link>
    </div>
  );
}
