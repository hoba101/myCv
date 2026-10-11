"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, RotateCcw, Sparkles, X } from "lucide-react";
import { analyse, evaluate, type SymbolEnv } from "@/app/lib/physics/dimensions";
import type { ExamplePreset } from "@/app/lib/physics/types";
import { DimChips, DimText } from "./DimChips";

type Verdict = "correct" | "incorrect" | "indeterminate" | "solved" | "expression";

const VERDICT_STYLES: Record<Verdict, string> = {
  correct: "verdict-good",
  incorrect: "verdict-bad",
  indeterminate: "verdict-warn",
  solved: "verdict-info",
  expression: "verdict-info",
};

const VERDICT_LABELS: Record<Verdict, string> = {
  correct: "Dimensionally correct",
  incorrect: "Not homogeneous",
  indeterminate: "Cannot determine",
  solved: "Dimensions solved",
  expression: "Dimensions",
};

/** Common symbols offered as autocomplete for the solve-for box. */
const SOLVE_SUGGESTIONS = ["a", "b", "c", "x", "k", "n", "alpha", "beta", "eta", "lambda"];

interface Outcome {
  verdict: Verdict;
  message: string;
  left?: ReturnType<typeof evaluate>["dim"];
  right?: ReturnType<typeof evaluate>["dim"];
  solved?: Record<string, ReturnType<typeof evaluate>["dim"]>;
  detail?: string;
}

export default function FormulaLab({
  title,
  description,
  presets,
}: {
  title: string;
  description: string;
  presets: ExamplePreset[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const active = activeIndex === null ? null : presets[activeIndex];

  const [draft, setDraft] = useState("");
  const [solveDraft, setSolveDraft] = useState("");

  const outcome = useMemo<Outcome | null>(() => {
    const equation = draft.trim().length > 0 ? draft : (active?.equation ?? "");
    if (!equation.trim()) return null;

    const env: SymbolEnv = active?.symbols ?? {};
    // A typed symbol list overrides whatever the preset asked for, so any
    // equation the student writes can be solved for.
    const solveFor = solveDraft
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean);

    if (!equation.includes("=")) {
      const result = evaluate(equation, env);
      return result.error
        ? { verdict: "indeterminate", message: result.error }
        : {
            verdict: "expression",
            message: "This is a single expression, not an equation.",
            left: result.dim,
          };
    }

    const result = analyse(equation, solveFor, env);
    return {
      verdict: result.verdict,
      message: result.message,
      left: result.left ?? undefined,
      right: result.right ?? undefined,
      solved: result.solved,
      detail: result.error,
    };
  }, [draft, solveDraft, active]);

  const reset = () => {
    setDraft("");
    setSolveDraft("");
    setActiveIndex(0);
  };

  const VerdictIcon =
    outcome?.verdict === "correct" ? Check : outcome?.verdict === "incorrect" ? X : AlertTriangle;

  return (
    <div className="lab">
      <header className="lab-head">
        <h3 className="lab-title">
          <Sparkles size={18} strokeWidth={2.5} />
          {title}
        </h3>
        <p className="lab-desc">{description}</p>
      </header>

      <div className="lab-presets" role="group" aria-label="Example formulas">
        {presets.map((preset, index) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setDraft("");
              setSolveDraft("");
            }}
            className={`lab-preset ${index === activeIndex ? "lab-preset-active" : ""}`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="lab-input-row">
        <input
          type="text"
          value={draft || (active?.display ?? active?.equation ?? "")}
          onChange={(event) => {
            setDraft(event.target.value);
            setActiveIndex(null);
          }}
          placeholder="Type a formula, e.g. F = m*v2/r"
          spellCheck={false}
          autoComplete="off"
          className="lab-input"
          aria-label="Formula to analyse"
        />
        <button type="button" onClick={reset} className="lab-reset" aria-label="Reset">
          <RotateCcw size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="lab-input-row">
        <input
          type="text"
          value={solveDraft}
          onChange={(event) => {
            setSolveDraft(event.target.value);
            setActiveIndex(null);
          }}
          placeholder="Solve for (optional) — e.g. a b c"
          spellCheck={false}
          autoComplete="off"
          className="lab-input lab-input-solve"
          aria-label="Symbols to solve for"
          list="physics-symbols"
        />
        <datalist id="physics-symbols">
          {SOLVE_SUGGESTIONS.map((symbol) => (
            <option key={symbol} value={symbol} />
          ))}
        </datalist>
      </div>

      <p className="lab-hint">
        Engine syntax: <code>*</code> or nothing for multiplication, <code>/</code> for division,{" "}
        <code>^</code> or a trailing digit for powers (<code>v2</code> = v²), <code>sqrt(…)</code>{" "}
        for roots. Constants like <code>pi</code>, <code>sin</code> and <code>cos</code> are
        dimensionless. Leave the second box empty to check homogeneity, or name symbols to isolate
        them.
      </p>

      {outcome && (
        <div className={`lab-result ${VERDICT_STYLES[outcome.verdict]}`} aria-live="polite">
          <div className="lab-result-head">
            <span className="lab-verdict">
              <VerdictIcon size={16} strokeWidth={3} />
              {VERDICT_LABELS[outcome.verdict]}
            </span>
            {draft.trim().length > 0 && (
              <span className="lab-custom-tag">your formula</span>
            )}
          </div>

          {outcome.solved && Object.keys(outcome.solved).length > 0 ? (
            <ul className="lab-solved">
              {Object.entries(outcome.solved).map(([symbol, dim]) => (
                <li key={symbol} className="lab-solved-row">
                  <span className="lab-solved-symbol">[{symbol}]</span>
                  <DimText dim={dim} />
                  <DimChips dim={dim} size="sm" />
                </li>
              ))}
            </ul>
          ) : (
            outcome.left && (
              <div className="lab-sides">
                <div className="lab-side">
                  <span className="lab-side-label">
                    {outcome.verdict === "expression" ? "Result" : "Left-hand side"}
                  </span>
                  <DimText dim={outcome.left} />
                  <DimChips dim={outcome.left} size="sm" />
                </div>
                {outcome.right && (
                  <div className="lab-side">
                    <span className="lab-side-label">Right-hand side</span>
                    <DimText dim={outcome.right} />
                    <DimChips dim={outcome.right} size="sm" />
                  </div>
                )}
              </div>
            )
          )}

          <p className="lab-message">{outcome.detail ?? outcome.message}</p>

          {active?.note && <p className="lab-note">{active.note}</p>}

          {active?.expect && outcome.verdict !== "expression" && (
            <p className="lab-expect">
              Expected from the textbook:{" "}
              <strong>{active.expect === "correct" ? "correct" : "not correct"}</strong>
              {outcome.verdict === active.expect ? " — matches." : " — mismatch, check the formula."}
            </p>
          )}
        </div>
      )}

      {!outcome && <p className="lab-empty">Pick a preset or type a formula to begin.</p>}

      <p className="lab-foot">
        Every dimension on this card is derived at runtime from{" "}
        <code>app/lib/physics/dimensions.ts</code> — nothing here is hard-coded.
      </p>
    </div>
  );
}
