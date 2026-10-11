"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import { dimVec, type DimVec } from "@/app/lib/physics/dimensions";
import { DimChips, DimText } from "./DimChips";

/** Prefix definitions exactly as tabulated in §1.3 of the textbook. */
const PREFIXES: Record<number, { symbol: string; name: string }> = {
  [-18]: { symbol: "a", name: "atto" },
  [-15]: { symbol: "f", name: "femto" },
  [-12]: { symbol: "p", name: "pico" },
  [-9]: { symbol: "n", name: "nano" },
  [-6]: { symbol: "µ", name: "micro" },
  [-3]: { symbol: "m", name: "milli" },
  [-2]: { symbol: "c", name: "centi" },
  [-1]: { symbol: "d", name: "deci" },
  [0]: { symbol: "", name: "" },
  [1]: { symbol: "da", name: "deca" },
  [2]: { symbol: "h", name: "hecto" },
  [3]: { symbol: "k", name: "kilo" },
  [6]: { symbol: "M", name: "mega" },
  [9]: { symbol: "G", name: "giga" },
  [12]: { symbol: "T", name: "tera" },
  [15]: { symbol: "P", name: "peta" },
  [18]: { symbol: "E", name: "exa" },
};

const PREFIX_EXPONENTS = Object.keys(PREFIXES)
  .map(Number)
  .sort((a, b) => b - a);

const EXPONENT_MIN = -18;
const EXPONENT_MAX = 18;
const EXPONENT_STOPS = Array.from(
  { length: EXPONENT_MAX - EXPONENT_MIN + 1 },
  (_, index) => EXPONENT_MIN + index,
);

/**
 * Standard SI presentation: pick the largest prefix whose exponent does not
 * exceed the value, so the mantissa always lands in [1, 1000).
 *
 * This is why 10⁻¹⁰ m reads as "100 pm" rather than as an impossible
 * "0.1 angstrom-prefixed metre" — there is no 10⁻¹⁰ prefix, and the unit the
 * textbook calls an angstrom is simply 100 picometres.
 */
function decompose(exponent: number) {
  let prefix = EXPONENT_MIN;
  for (const candidate of PREFIX_EXPONENTS) {
    if (candidate <= exponent) {
      prefix = candidate;
      break;
    }
  }
  return { prefix, mantissa: exponent - prefix };
}

interface BaseQuantity {
  id: string;
  label: string;
  /** SI unit symbol the prefix attaches to, e.g. "m" in "km". */
  symbol: string;
  dim: DimVec;
  /** Spelled-out unit; the prefix is prepended to form "kilometre". */
  noun: string;
}

const BASES: BaseQuantity[] = [
  { id: "length", label: "Length", symbol: "m", dim: dimVec({ L: 1 }), noun: "metre" },
  { id: "mass", label: "Mass", symbol: "kg", dim: dimVec({ M: 1 }), noun: "kilogram" },
  { id: "time", label: "Time", symbol: "s", dim: dimVec({ T: 1 }), noun: "second" },
  {
    id: "force",
    label: "Force",
    symbol: "N",
    dim: dimVec({ M: 1, L: 1, T: -2 }),
    noun: "newton",
  },
  {
    id: "energy",
    label: "Energy",
    symbol: "J",
    dim: dimVec({ M: 1, L: 2, T: -2 }),
    noun: "joule",
  },
  {
    id: "power",
    label: "Power",
    symbol: "W",
    dim: dimVec({ M: 1, L: 2, T: -3 }),
    noun: "watt",
  },
  {
    id: "pressure",
    label: "Pressure",
    symbol: "Pa",
    dim: dimVec({ M: 1, L: -1, T: -2 }),
    noun: "pascal",
  },
  { id: "frequency", label: "Frequency", symbol: "Hz", dim: dimVec({ T: -1 }), noun: "hertz" },
  { id: "current", label: "Current", symbol: "A", dim: dimVec({ I: 1 }), noun: "ampere" },
  {
    id: "temperature",
    label: "Temperature",
    symbol: "K",
    dim: dimVec({ Θ: 1 }),
    noun: "kelvin",
  },
  { id: "area", label: "Area", symbol: "m²", dim: dimVec({ L: 2 }), noun: "square metre" },
  { id: "volume", label: "Volume", symbol: "m³", dim: dimVec({ L: 3 }), noun: "cubic metre" },
  {
    id: "density",
    label: "Density",
    symbol: "kg/m³",
    dim: dimVec({ M: 1, L: -3 }),
    noun: "kilogram per cubic metre",
  },
  {
    id: "velocity",
    label: "Velocity",
    symbol: "m/s",
    dim: dimVec({ L: 1, T: -1 }),
    noun: "metre per second",
  },
  {
    id: "acceleration",
    label: "Acceleration",
    symbol: "m/s²",
    dim: dimVec({ L: 1, T: -2 }),
    noun: "metre per second squared",
  },
];

/** Named landmarks for length from §1.3, shown as quick jumps. */
const LENGTH_MARKS: { exponent: number; label: string; value: string }[] = [
  { exponent: -15, label: "fermi", value: "1 fm = 10⁻¹⁵ m" },
  { exponent: -10, label: "angstrom", value: "1 Å = 10⁻¹⁰ m" },
  { exponent: -6, label: "micron", value: "1 µm = 10⁻⁶ m" },
  { exponent: 0, label: "metre", value: "1 m" },
  { exponent: 3, label: "kilometre", value: "1 km = 10³ m" },
  { exponent: 15, label: "light year", value: "1 ly = 9.46 × 10¹⁵ m" },
  { exponent: 16, label: "parsec", value: "1 pc = 3.26 light years" },
];

const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
  "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
};

function superscript(value: number): string {
  return String(value)
    .split("")
    .map((ch) => SUPERSCRIPT[ch] ?? ch)
    .join("");
}

/** SI exponents are conventionally spaced in threes. */
function formatPower(exponent: number): string {
  if (exponent === 0) return "10⁰";
  const sign = exponent < 0 ? "⁻" : "";
  const magnitude = Math.abs(exponent);
  const [tens, units] = String(magnitude).padStart(2, "0").split("");
  return magnitude >= 10
    ? `10${sign}${tens}${superscript(Number(units))}`
    : `10${sign}${units}`;
}

export default function ScaleSlider({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [baseId, setBaseId] = useState("length");
  const [exponent, setExponent] = useState(-10);

  const base = BASES.find((entry) => entry.id === baseId) ?? BASES[0];
  const { prefix, mantissa } = decompose(exponent);
  const meta = PREFIXES[prefix];
  const value = 10 ** mantissa;
  const unitSymbol = `${meta.symbol}${base.symbol}`;
  const unitName = prefix === 0 ? base.noun : `${meta.name}${base.noun}`;

  return (
    <div className="lab">
      <header className="lab-head">
        <h3 className="lab-title">
          <Ruler size={18} strokeWidth={2.5} />
          {title}
        </h3>
        <p className="lab-desc">{description}</p>
      </header>

      <div className="lab-presets" role="group" aria-label="Physical quantity">
        {BASES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setBaseId(entry.id)}
            aria-pressed={entry.id === baseId}
            className={`lab-preset ${entry.id === baseId ? "lab-preset-active" : ""}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="scale">
        <output className="scale-readout" aria-live="polite">
          <span className="scale-value">
            {value}
            {unitSymbol}
          </span>
          <span className="scale-words">{unitName}</span>
        </output>

        <label className="scale-slider-row">
          <span className="conv-label">Power of ten</span>
          <input
            type="range"
            min={EXPONENT_MIN}
            max={EXPONENT_MAX}
            step={1}
            value={exponent}
            onChange={(event) => setExponent(Number(event.target.value))}
            className="scale-slider"
            aria-label={`Order of magnitude for ${base.label}`}
            aria-valuetext={`10 to the power of ${exponent}`}
          />
          <span className="scale-power">{formatPower(exponent)}</span>
        </label>

        <div className="scale-stops" aria-hidden="true">
          {EXPONENT_STOPS.map((stop) => (
            <span
              key={stop}
              className={`scale-stop ${stop === exponent ? "scale-stop-active" : ""} ${
                PREFIXES[stop] ? "scale-stop-prefixed" : ""
              }`}
            />
          ))}
        </div>

        <div className="scale-detail">
          <p>
            <strong>
              {value} {unitSymbol}
            </strong>{" "}
            = {formatPower(exponent)} {base.symbol}
            {prefix === 0 ? "" : ` — the ${meta.name} form of ${base.label.toLowerCase()}`}
          </p>
          <p className="scale-dims">
            <DimText dim={base.dim} />
            <DimChips dim={base.dim} size="sm" />
            <span className="scale-dims-label">unchanged by the prefix</span>
          </p>
        </div>
      </div>

      {baseId === "length" && (
        <div className="scale-marks">
          <p className="scale-marks-label">Landmarks from §1.3</p>
          <div className="scale-marks-list">
            {LENGTH_MARKS.map((mark) => (
              <button
                key={mark.label}
                type="button"
                onClick={() => setExponent(mark.exponent)}
                className={`brutal-pill scale-mark ${mark.exponent === exponent ? "scale-mark-active" : ""}`}
              >
                <span className="scale-mark-label">{mark.label}</span>
                <span className="scale-mark-value">{mark.value}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
