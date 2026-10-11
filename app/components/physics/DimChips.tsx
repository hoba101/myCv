import {
  BASE_DIMENSIONS,
  DIMENSION_LABELS,
  type DimVec,
  formatDim,
  formatDimSpaced,
  siUnitFor,
} from "@/app/lib/physics/dimensions";

/**
 * Renders the non-zero powers of a dimension vector as coloured chips.
 * Dimensionless vectors collapse to a single muted chip.
 */
export function DimChips({ dim, size = "md" }: { dim: DimVec; size?: "sm" | "md" }) {
  const active = BASE_DIMENSIONS.filter((base) => !dim[base].isZero);

  if (active.length === 0) {
    return (
      <span
        className={`dim-chip dim-chip-none ${size === "sm" ? "dim-chip-sm" : ""}`}
        title="No dimensions"
      >
        dimensionless
      </span>
    );
  }

  return (
    <span className="dim-chips">
      {active.map((base) => (
        <span
          key={base}
          className={`dim-chip dim-chip-${base} ${size === "sm" ? "dim-chip-sm" : ""}`}
          title={`${DIMENSION_LABELS[base]} raised to ${dim[base].toString()}`}
        >
          <span className="dim-chip-base">{base}</span>
          <sup className="dim-chip-power">{dim[base].toString()}</sup>
        </span>
      ))}
    </span>
  );
}

/** The bracketed form, e.g. `[M1L1T-2]`, for places that want a single token. */
export function DimText({ dim }: { dim: DimVec }) {
  return <span className="dim-text">{formatDim(dim)}</span>;
}

export function DimFormula({ dim }: { dim: DimVec }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <DimText dim={dim} />
      <span className="dim-spaced">{formatDimSpaced(dim)}</span>
      <span className="dim-si">SI: {siUnitFor(dim)}</span>
    </span>
  );
}
