"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Ban } from "lucide-react";
import { convert, formatDim, groupedUnits } from "@/app/lib/physics/dimensions";
import { DimChips } from "./DimChips";

const GROUPS = groupedUnits();

/** Renders large and small numbers without floating-point noise. */
function formatValue(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 1e6 || magnitude < 1e-4) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }
  return String(Number(value.toPrecision(10)));
}

export default function UnitConverter({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [groupIndex, setGroupIndex] = useState(() =>
    GROUPS.findIndex((group) => group.label === "Force"),
  );
  const group = GROUPS[groupIndex] ?? GROUPS[0];

  const [fromId, setFromId] = useState(() => group.units[0].id);
  const [toId, setToId] = useState(() => group.units[1]?.id ?? group.units[0].id);
  const [value, setValue] = useState("1");

  const parsed = Number.parseFloat(value);
  const valid = Number.isFinite(parsed);

  const result = useMemo(
    () => (valid ? convert(parsed, fromId, toId) : null),
    [valid, parsed, fromId, toId],
  );

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const changeGroup = (index: number) => {
    const next = GROUPS[index];
    setGroupIndex(index);
    setFromId(next.units[0].id);
    setToId(next.units[1]?.id ?? next.units[0].id);
  };

  return (
    <div className="lab">
      <header className="lab-head">
        <h3 className="lab-title">
          <ArrowRightLeft size={18} strokeWidth={2.5} />
          {title}
        </h3>
        <p className="lab-desc">{description}</p>
      </header>

      <div className="lab-presets" role="group" aria-label="Physical quantity">
        {GROUPS.map((entry, index) => (
          <button
            key={entry.label}
            type="button"
            onClick={() => changeGroup(index)}
            className={`lab-preset ${index === groupIndex ? "lab-preset-active" : ""}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="conv-grid">
        <div className="conv-field">
          <label className="conv-label" htmlFor="conv-value">
            Value
          </label>
          <input
            id="conv-value"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="lab-input"
            placeholder="1"
          />
        </div>

        <div className="conv-field">
          <label className="conv-label" htmlFor="conv-from">
            From
          </label>
          <select
            id="conv-from"
            value={fromId}
            onChange={(event) => setFromId(event.target.value)}
            className="lab-input"
          >
            {group.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.symbol} · {unit.system}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={swap} className="conv-swap" aria-label="Swap units">
          <ArrowRightLeft size={18} strokeWidth={2.5} />
        </button>

        <div className="conv-field">
          <label className="conv-label" htmlFor="conv-to">
            To
          </label>
          <select
            id="conv-to"
            value={toId}
            onChange={(event) => setToId(event.target.value)}
            className="lab-input"
          >
            {group.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.symbol} · {unit.system}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && !valid && <p className="lab-empty">Enter a number to convert.</p>}

      {valid && result?.ok && (
        <div className="conv-result" aria-live="polite">
          <p className="conv-equation">
            {formatValue(parsed)}{" "}
            <span className="conv-unit">{group.units.find((u) => u.id === fromId)?.symbol}</span>{" "}
            ={" "}
            <strong>{formatValue(result.value!)}</strong>{" "}
            <span className="conv-unit">{group.units.find((u) => u.id === toId)?.symbol}</span>
          </p>
          <p className="conv-dims">
            both are {formatDim(group.units[0].dim)}{" "}
            <DimChips dim={group.units[0].dim} size="sm" />
          </p>
        </div>
      )}

      {valid && result && !result.ok && (
        <div className="conv-result conv-result-error" aria-live="polite">
          <p className="conv-equation">
            <Ban size={16} strokeWidth={2.5} /> {result.error}
          </p>
        </div>
      )}
    </div>
  );
}
