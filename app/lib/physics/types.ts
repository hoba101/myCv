/**
 * Content model for the physics platform.
 *
 * Every chapter is plain data validated by these types, so Chapters 2-13 are
 * added by writing a data file and never by touching a component.
 */

import type { DimSpec } from "./dimensions";

/* ------------------------------------------------------------------ */
/* Building blocks                                                      */
/* ------------------------------------------------------------------ */

/** A callout used for definitions, notes, warnings and key takeaways. */
export interface Callout {
  kind: "definition" | "note" | "warning" | "key" | "example";
  title?: string;
  body: string;
  /** Optional formula rendered beside the body, parsed by the formula engine. */
  formula?: string;
}

/** A row of the reference tables (fundamental units, dimensional formulae). */
export interface TableData {
  caption: string;
  columns: string[];
  rows: string[][];
}

export type TopicKind = "text" | "callout" | "table" | "list";

export interface Topic {
  id: string;
  kind: TopicKind;
  /** Plain paragraph copy. */
  body?: string;
  /** Bullet points, rendered as a checklist. */
  items?: string[];
  callout?: Callout;
  table?: TableData;
}

/* ------------------------------------------------------------------ */
/* Interactive blocks                                                   */
/* ------------------------------------------------------------------ */

export interface ExamplePreset {
  label: string;
  /** Equation in engine syntax, e.g. `F = m*v2/r`. */
  equation: string;
  /** Display form shown in the input, e.g. `F = mv²/r`. */
  display?: string;
  /** Overrides for symbols whose meaning is not global, e.g. `h` = Planck. */
  symbols?: Record<string, DimSpec>;
  /** Symbols to isolate when the preset asks "find the dimensions of…". */
  solveFor?: string[];
  expect?: "correct" | "incorrect";
  note?: string;
}

/** The live calculator shown in the Interactive Formulas section. */
export interface FormulaLab {
  title: string;
  description: string;
  presets: ExamplePreset[];
}

/** Worked example with progressive step reveal. */
export interface SolvedStep {
  title: string;
  detail: string;
  formula?: string;
}

export interface SolvedExample {
  id: string;
  number: number;
  title: string;
  problem: string;
  /** Display form of the relation under test. */
  given?: string;
  /** Free-text closing note, usually the key takeaway. */
  conclusion: string;
  steps: SolvedStep[];
  /** Optional live checker for the relation under test. */
  verify?: ExamplePreset;
}

export interface Mcq {
  id: string;
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: Mcq[];
}

export interface ShortAnswer {
  id: string;
  question: string;
  /** Model answer shown after the student commits to one. */
  answer: string;
}

/* ------------------------------------------------------------------ */
/* Sections and chapters                                                */
/* ------------------------------------------------------------------ */

/** One card in the at-a-glance Visual Summary. */
export interface SummaryCard {
  title: string;
  points: string[];
  /** Formula rendered live beside the card, e.g. `Q = n*u`. */
  formula?: string;
  /** Labels for the coloured dimension chips, e.g. { M: "Mass" }. */
  chips?: { symbol: string; label: string; exponent?: string }[];
}

export type SectionBlock =
  | { kind: "summary"; title: string; intro: string; cards: SummaryCard[] }
  | { kind: "topics"; topics: Topic[] }
  | { kind: "lab"; lab: FormulaLab }
  | { kind: "converter"; title: string; description: string }
  | { kind: "scaleSlider"; title: string; description: string }
  | { kind: "explorer"; title: string; description: string }
  | { kind: "examples"; heading: string; examples: SolvedExample[] }
  | { kind: "quiz"; quiz: Quiz }
  | { kind: "shortAnswer"; heading: string; items: ShortAnswer[] };

export interface Section {
  id: string;
  /** Textbook number, e.g. "1.4". */
  number: string;
  title: string;
  /** One-line summary used in the chapter outline. */
  summary: string;
  blocks: SectionBlock[];
}

export type ChapterStatus = "complete" | "in-progress" | "planned";

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  /** Short label for the collapsed sidebar. */
  shortTitle: string;
  objectives: string[];
  status: ChapterStatus;
  /** Approximate study time in minutes, shown in the chapter header. */
  minutes: number;
  sections: Section[];
}

/** Registry entry used by the sidebar before a chapter's data is loaded. */
export interface ChapterSummary {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  status: ChapterStatus;
  objectives: string[];
  /** Approximate study time in minutes, shown on the index cards. */
  minutes: number;
}
