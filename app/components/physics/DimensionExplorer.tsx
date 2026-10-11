"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  DIMENSION_LABELS,
  dimVec,
  dimsEqual,
  formatDim,
  siUnitFor,
  UNITS,
} from "@/app/lib/physics/dimensions";
import { DimChips, DimText } from "./DimChips";

const EXPONENT_MIN = -3;
const EXPONENT_MAX = 3;

type SliderBase = "M" | "L" | "T";

const SLIDER_BASES: SliderBase[] = ["M", "L", "T"];

/** Physical quantities a student is likely to hit, used to name the result. */
const NAMED: { label: string; formula: string; m: number; l: number; t: number }[] = [
  { label: "Dimensionless (strain, angle)", formula: "—", m: 0, l: 0, t: 0 },
  { label: "Area", formula: "length × breadth", m: 0, l: 2, t: 0 },
  { label: "Volume", formula: "length × breadth × height", m: 0, l: 3, t: 0 },
  { label: "Velocity", formula: "distance / time", m: 0, l: 1, t: -1 },
  { label: "Acceleration", formula: "velocity / time", m: 0, l: 1, t: -2 },
  { label: "Momentum", formula: "mass × velocity", m: 1, l: 1, t: -1 },
  { label: "Force", formula: "mass × acceleration", m: 1, l: 1, t: -2 },
  { label: "Energy / Work", formula: "force × distance", m: 1, l: 2, t: -2 },
  { label: "Power", formula: "work / time", m: 1, l: 2, t: -3 },
  { label: "Pressure / Stress", formula: "force / area", m: 1, l: -1, t: -2 },
  { label: "Density", formula: "mass / volume", m: 1, l: -3, t: 0 },
  { label: "Frequency", formula: "1 / time period", m: 0, l: 0, t: -1 },
  { label: "Surface tension", formula: "force / length", m: 1, l: 0, t: -2 },
];

/** Named SI units matching a dimension vector, used as a hint. */
function knownUnitFor(m: number, l: number, t: number) {
  const target = dimVec({ M: m, L: l, T: t });
  const match = UNITS.find((unit) => dimsEqual(unit.dim, target));
  return match ? `${match.symbol} (${match.system})` : null;
}

export default function DimensionExplorer({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [exponents, setExponents] = useState<Record<SliderBase, number>>({
    M: 1,
    L: 1,
    T: -2,
  });
  const vector = dimVec(exponents);
  const unit = siUnitFor(vector);

  const named = NAMED.find(
    (entry) => entry.m === exponents.M && entry.l === exponents.L && entry.t === exponents.T,
  );
  const knownUnit = knownUnitFor(exponents.M, exponents.L, exponents.T);

  const set = (base: SliderBase, value: number) =>
    setExponents((current) => ({ ...current, [base]: value }));

  return (
    <div className="lab">
      <header className="lab-head">
        <h3 className="lab-title">
          <SlidersHorizontal size={18} strokeWidth={2.5} />
          {title}
        </h3>
        <p className="lab-desc">{description}</p>
      </header>

      <div className="explorer">
        <div className="explorer-sliders">
          {SLIDER_BASES.map((base) => (
            <label key={base} className="explorer-row">
              <span className="explorer-label">
                <span className="explorer-symbol">{base}</span>
                <span className="explorer-label-text">{DIMENSION_LABELS[base]}</span>
                <output className="explorer-value">
                  {exponents[base] > 0 ? `+${exponents[base]}` : exponents[base]}
                </output>
              </span>
              <input
                type="range"
                min={EXPONENT_MIN}
                max={EXPONENT_MAX}
                step={1}
                value={exponents[base]}
                onChange={(event) => set(base, Number(event.target.value))}
                className="explorer-slider"
                aria-label={`Exponent of ${DIMENSION_LABELS[base]}`}
                aria-valuetext={`${base} to the power of ${exponents[base]}`}
              />
            </label>
          ))}
        </div>

        <div className="explorer-output" aria-live="polite">
          <span className="conv-label">Dimensions</span>
          <p className="explorer-dim">
            <DimText dim={vector} />
          </p>
          <DimChips dim={vector} />

          <span className="conv-label explorer-unit-label">SI unit</span>
          <p className="explorer-unit">{unit}</p>

          {knownUnit && (
            <p className="explorer-hint">
              The named SI unit for this dimension is <strong>{knownUnit}</strong>.
            </p>
          )}

          <span className="conv-label explorer-unit-label">
            This matches
          </span>
          {named ? (
            <p className="explorer-named">
              <strong>{named.label}</strong>
              <span className="explorer-formula">{named.formula}</span>
            </p>
          ) : (
            <p className="explorer-hint">
              No standard quantity in the table matches exactly — but it is still a perfectly valid
              combination of the fundamental units.
            </p>
          )}
        </div>
      </div>

      <p className="lab-foot">
        Dimensions describe the <strong>nature</strong> of a quantity, never its magnitude. Compare{" "}
        <code>{formatDim(dimVec({ M: 1, L: 1, T: -2 }))}</code> for a 1&nbsp;N force and a 10&nbsp;MN
        force — same dimensions, very different quantities.
      </p>
    </div>
  );
}
