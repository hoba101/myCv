"use client";

import { useState } from "react";
import { Check, RotateCcw, Shuffle, Trophy, X } from "lucide-react";
import type { Mcq, Quiz as QuizData } from "@/app/lib/physics/types";
import { clearPersistentState, usePersistentState } from "./usePersistentState";

const STORAGE_KEY = "physics:quiz";
const DEFAULT_STATE: Record<string, number> = {};

/**
 * Deterministic shuffle: the same seed always yields the same order, so a
 * reload mid-quiz does not reshuffle underneath the student.
 */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let state = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shuffleOptions(question: Mcq): Mcq {
  const order = seededShuffle(
    question.options.map((_, index) => index),
    question.id.length * 7919 + question.answer * 31,
  );
  const options = order.map((index) => question.options[index]);
  return {
    ...question,
    options,
    answer: order.indexOf(question.answer),
  };
}

export default function Quiz({ quiz }: { quiz: QuizData }) {
  const [shuffled, setShuffled] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const [answers, setAnswers] = usePersistentState<Record<string, number>>(
    `${STORAGE_KEY}:${quiz.title}`,
    DEFAULT_STATE,
  );

  // Question order depends on the shuffle flag only, so the stored answers —
  // which are keyed by question id — stay valid across reshuffles.
  const questions = shuffled
    ? seededShuffle(quiz.questions, 20260101).map(shuffleOptions)
    : quiz.questions;

  const total = questions.length;
  const answered = questions.filter((question) => answers[question.id] !== undefined).length;
  const score = questions.filter((question) => answers[question.id] === question.answer).length;
  const complete = answered === total;

  const reset = () => {
    clearPersistentState(`${STORAGE_KEY}:${quiz.title}`);
    setAnswers({});
    setFocusIndex(0);
  };

  const toggleShuffle = () => {
    setShuffled((value) => !value);
    setFocusIndex(0);
  };

  const focusQuestion = questions[focusIndex];

  return (
    <div className="quiz">
      <header className="quiz-head">
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-desc">{quiz.description}</p>

        <div className="quiz-meter" aria-live="polite">
          <div className="quiz-meter-bar">
            <span style={{ width: `${total ? (score / total) * 100 : 0}%` }} />
          </div>
          <span className="quiz-meter-text">
            {score} / {total} correct{answered < total && ` · ${answered} answered`}
          </span>
          <button
            type="button"
            onClick={toggleShuffle}
            aria-pressed={shuffled}
            className={`quiz-tool ${shuffled ? "quiz-tool-active" : ""}`}
          >
            <Shuffle size={14} strokeWidth={2.5} />
            {shuffled ? "Shuffled" : "Shuffle"}
          </button>
        </div>

        {answered > 0 && (
          <div className="quiz-dots" role="group" aria-label="Jump to question">
            {questions.map((question, index) => {
              const chosen = answers[question.id];
              const state =
                chosen === undefined
                  ? "empty"
                  : chosen === question.answer
                    ? "correct"
                    : "wrong";
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setFocusIndex(index)}
                  aria-label={`Question ${index + 1}, ${state}`}
                  aria-current={index === focusIndex ? "true" : undefined}
                  className={`quiz-dot quiz-dot-${state} ${index === focusIndex ? "quiz-dot-focus" : ""}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {focusQuestion && (
        <QuestionCard
          key={focusQuestion.id}
          question={focusQuestion}
          index={focusIndex}
          total={total}
          chosen={answers[focusQuestion.id]}
          onAnswer={(optionIndex) =>
            setAnswers((current) => ({ ...current, [focusQuestion.id]: optionIndex }))
          }
          onPrev={focusIndex > 0 ? () => setFocusIndex(focusIndex - 1) : undefined}
          onNext={focusIndex < total - 1 ? () => setFocusIndex(focusIndex + 1) : undefined}
        />
      )}

      {complete && (
        <div className="quiz-summary">
          <Trophy size={18} strokeWidth={2.5} />
          <p>
            You scored <strong>{score} out of {total}</strong>.{" "}
            {score === total
              ? "Full marks — dimensional analysis is in good shape."
              : "Re-read the Visual Summary and try the Formula Lab again."}
          </p>
          <button type="button" className="brutal-btn" onClick={reset}>
            <RotateCcw size={15} strokeWidth={2.5} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  index,
  total,
  chosen,
  onAnswer,
  onPrev,
  onNext,
}: {
  question: Mcq;
  index: number;
  total: number;
  chosen: number | undefined;
  onAnswer: (optionIndex: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const revealed = chosen !== undefined;
  const isRight = chosen === question.answer;

  return (
    <article className="brutal-card quiz-item">
      <p className="quiz-question">
        <span className="quiz-index">{index + 1}</span>
        <span>
          {question.question}
          <span className="quiz-count">
            {" "}
            of {total}
          </span>
        </span>
      </p>

      <ul className="quiz-options">
        {question.options.map((option, optionIndex) => {
          const state = !revealed
            ? "idle"
            : optionIndex === question.answer
              ? "correct"
              : optionIndex === chosen
                ? "wrong"
                : "muted";

          return (
            <li key={option}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => onAnswer(optionIndex)}
                className={`quiz-option quiz-option-${state}`}
              >
                <span className="quiz-option-key">{String.fromCharCode(65 + optionIndex)}</span>
                <span className="quiz-option-text">{option}</span>
                {state === "correct" && <Check size={16} strokeWidth={3} />}
                {state === "wrong" && <X size={16} strokeWidth={3} />}
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className={`quiz-feedback ${isRight ? "quiz-feedback-good" : "quiz-feedback-bad"}`}>
          <strong>
            {isRight ? "Correct." : `Not quite — the answer is ${String.fromCharCode(65 + question.answer)}.`}
          </strong>{" "}
          {question.explanation}
        </div>
      )}

      <div className="quiz-nav">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className="brutal-btn"
        >
          Previous
        </button>
        {onNext ? (
          <button type="button" onClick={onNext} className="brutal-btn brutal-btn-primary">
            Next
          </button>
        ) : (
          <span className="quiz-nav-end">Last question</span>
        )}
      </div>
    </article>
  );
}
