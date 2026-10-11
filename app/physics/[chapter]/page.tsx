import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Target } from "lucide-react";
import ChapterOutline from "@/app/components/physics/ChapterOutline";
import ChapterPager from "@/app/components/physics/ChapterPager";
import SectionBlocks from "@/app/components/physics/SectionBlocks";
import { CHAPTERS, getChapterSummary, getNeighbours } from "@/app/lib/physics/chapters";
import { getChapter, hasChapter } from "@/app/lib/physics/chapters/registry";

interface PageProps {
  params: Promise<{ chapter: string }>;
}

/** Pre-renders the chapters whose content exists, so they are served statically. */
export function generateStaticParams() {
  return CHAPTERS.filter((chapter) => chapter.status === "complete").map((chapter) => ({
    chapter: chapter.slug,
  }));
}

/**
 * Only published chapters are routable.
 *
 * Beyond matching the "Locked" state on the index page, this keeps `notFound()`
 * out of a streamed response. The sibling `loading.tsx` starts streaming
 * immediately, which would otherwise commit a 200 status code before the
 * not-found boundary could set a 404 (see the streaming status-code contract).
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const summary = getChapterSummary(slug);

  if (!summary || !hasChapter(slug)) {
    return { title: "Chapter not found" };
  }

  return {
    title: `Chapter ${summary.number}: ${summary.title} | Physics`,
    description: summary.objectives.join(" "),
    openGraph: {
      title: `Chapter ${summary.number}: ${summary.title}`,
      description: summary.objectives.join(" "),
      type: "article",
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  // `params` is a Promise in Next 16 — synchronous access was removed.
  const { chapter: slug } = await params;

  const summary = getChapterSummary(slug);
  if (!summary || !hasChapter(slug)) notFound();

  const chapter = await getChapter(slug);
  if (!chapter) notFound();

  const { previous, next } = getNeighbours(slug);

  return (
    <article className="chapter">
      <Link href="/physics" className="chapter-back">
        <ArrowLeft size={14} strokeWidth={2.5} />
        All chapters
      </Link>

      <header className="chapter-head">
        <p className="chapter-eyebrow">Chapter {chapter.number}</p>
        <h1 className="chapter-title">{chapter.title}</h1>

        <div className="chapter-meta">
          <span className="chapter-meta-item">
            <Clock size={14} strokeWidth={2.5} />
            About {chapter.minutes} minutes
          </span>
          <span className="chapter-meta-item">
            <Target size={14} strokeWidth={2.5} />
            {chapter.sections.length} sections
          </span>
        </div>

        <div className="objectives">
          <h2 className="objectives-title">Learning objectives</h2>
          <p className="objectives-intro">
            After going through this chapter, students will be able to:
          </p>
          <ul className="objectives-list">
            {chapter.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      </header>

      <ChapterOutline sections={chapter.sections} />

      <div className="chapter-body">
        {chapter.sections.map((section) => (
          <section key={section.id} id={section.id} className="chapter-section">
            <div className="chapter-section-head">
              <span className="chapter-section-number">{section.number}</span>
              <div>
                <h2 className="chapter-section-title">{section.title}</h2>
                <p className="chapter-section-summary">{section.summary}</p>
              </div>
            </div>
            <SectionBlocks blocks={section.blocks} />
          </section>
        ))}

        <ChapterPager previous={previous} next={next} />
      </div>
    </article>
  );
}
