"use client";

import type { KeyboardEvent } from "react";
import { ArrowRight, Eye, ListChecks, RotateCcw } from "lucide-react";
import { analyse, evaluate, type DimVec } from "@/app/lib/physics/dimensions";
import type { SolvedExample } from "@/app/lib/physics/types";
import { DimChips, DimText } from "./DimChips";
import { usePersistentState } from "./usePersistentState";

/**
 * A step's formula is only analysed when it actually is a dimensional
 * expression. Textbook prose such as `Q = n·u` is not one, so it falls back to
 * being displayed verbatim rather than throwing an engine error at the reader.
 */
function analyseFormula(formula: string): DimVec | null {
  try {
    if (formula.includes("=")) {
      const result = analyse(formula);
      return result.verdict === "correct" || result.verdict === "incorrect" ? result.left : null;
    }
    const result = evaluate(formula);
    return result.error ? null : result.dim;
  } catch {
    return null;
  }
}

function StepFormula({ formula }: { formula: string }) {
  const dim = analyseFormula(formula);
  return (
    <span className="step-formula">
      <code>{formula}</code>
      {dim && (
        <span className="step-formula-dim">
          <DimText dim={dim} />
          <DimChips dim={dim} size="sm" />
        </span>
      )}
    </span>
  );
}

export default function SolvedExamples({
  heading,
  examples,
}: {
  heading: string;
  examples: SolvedExample[];
}) {
  return (
    <div className="examples">
      <h3 className="examples-heading">{heading}</h3>
      <div className="examples-list">
        {examples.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>
    </div>
  );
}

const DEFAULT_PROGRESS: Record<string, number> = {};

function ExampleCard({ example }: { example: SolvedExample }) {
  const [progress, setProgress] = usePersistentState<Record<string, number>>(
    "physics:examples",
    DEFAULT_PROGRESS,
  );
  const revealed = Math.min(progress[example.id] ?? 0, example.steps.length);
  const allRevealed = revealed >= example.steps.length;

  const setRevealed = (next: number) =>
    setProgress((current) => ({ ...current, [example.id]: next }));

  const reset = () => setRevealed(0);
  const revealAll = () => setRevealed(example.steps.length);
  const showAll = allRevealed || revealed > 1;

  // Keyboard: right arrow reveals the next step, left arrow steps back.
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" && !allRevealed) {
      event.preventDefault();
      setRevealed(revealed + 1);
    } else if (event.key === "ArrowLeft" && revealed > 0) {
      event.preventDefault();
      setRevealed(revealed - 1);
    }
  };

  return (
    <article
      className="brutal-card example"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Example ${example.number}: ${example.title}`}
    >
      <header className="example-head">
        <span className="example-number">Example {example.number}</span>
        <h4 className="example-title">{example.title}</h4>
      </header>

      <p className="example-problem">{example.problem}</p>

      {example.given && (
        <p className="example-given">
          <code>{example.given}</code>
        </p>
      )}

      <ol className="example-steps">
        {example.steps.slice(0, revealed).map((step, index) => (
          <li key={step.title} className="example-step animate-fade-in-up">
            <div className="example-step-head">
              <span className="example-step-index">{index + 1}</span>
              <span className="example-step-title">{step.title}</span>
            </div>
            <p className="example-step-detail">{step.detail}</p>
            {step.formula && <StepFormula formula={step.formula} />}
          </li>
        ))}
      </ol>

      {allRevealed && (
        <p className="example-conclusion animate-fade-in-up">
          <strong>Conclusion: </strong>
          {example.conclusion}
        </p>
      )}

      {example.verify && <Verifier preset={example.verify} />}

      <div className="example-actions">
        {!allRevealed ? (
          <button
            type="button"
            className="brutal-btn brutal-btn-primary"
            onClick={() => setRevealed(revealed + 1)}
          >
            {revealed === 0 ? (
              <>
                <Eye size={15} strokeWidth={2.5} />
                Reveal step 1
              </>
            ) : (
              <>
                Reveal step {revealed + 1}
                <ArrowRight size={15} strokeWidth={2.5} />
              </>
            )}
          </button>
        ) : null}

        {showAll && (
          <button type="button" className="brutal-btn" onClick={reset}>
            <RotateCcw size={15} strokeWidth={2.5} />
            Start over
          </button>
        )}

        {!allRevealed && revealed > 0 && (
          <button type="button" className="brutal-btn" onClick={revealAll}>
            <ListChecks size={15} strokeWidth={2.5} />
            Reveal all
          </button>
        )}

        <span className="example-progress">
          {revealed} / {example.steps.length} steps
          <span className="example-progress-hint"> · ← → to step</span>
        </span>
      </div>
    </article>
  );
}

/** The live homogeneity checker attached to a worked example. */
function Verifier({ preset }: { preset: NonNullable<SolvedExample["verify"]> }) {
  const equation = preset.equation.includes("=")
    ? preset.equation
    : `x = ${preset.equation}`;

  const result = analyse(equation, preset.solveFor ?? [], preset.symbols ?? {});
  const good = result.verdict === "correct";

  return (
    <div className={`verifier ${good ? "verifier-good" : "verifier-bad"}`}>
      <span className="verifier-title">Check it yourself</span>
      <code className="verifier-eq">{preset.display ?? preset.equation}</code>

      {result.solved && Object.keys(result.solved).length > 0 ? (
        <ul className="verifier-solved">
          {Object.entries(result.solved).map(([symbol, dim]) => (
            <li key={symbol}>
              <strong>[{symbol}]</strong> <DimText dim={dim} />
              <DimChips dim={dim} size="sm" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="verifier-msg">{result.message}</p>
      )}

      {preset.note && <p className="verifier-note">{preset.note}</p>}
    </div>
  );
}
