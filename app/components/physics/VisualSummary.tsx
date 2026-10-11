import { Lightbulb } from "lucide-react";
import { dimVec } from "@/app/lib/physics/dimensions";
import type { SummaryCard } from "@/app/lib/physics/types";
import { DimChips } from "./DimChips";

function Card({ card, index }: { card: SummaryCard; index: number }) {
  return (
    <article className="summary-card animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <h4 className="summary-card-title">{card.title}</h4>
      <ul className="summary-card-points">
        {card.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      {card.formula && (
        <p className="summary-card-formula">
          <code>{card.formula}</code>
        </p>
      )}
      {card.chips && (
        <div className="summary-card-chips">
          {card.chips.map((chip) => (
            <span key={chip.symbol} className="summary-chip">
              <span className="summary-chip-symbol">{chip.symbol}</span>
              <span className="summary-chip-label">{chip.label}</span>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function VisualSummary({
  title,
  intro,
  cards,
}: {
  title: string;
  intro: string;
  cards: SummaryCard[];
}) {
  return (
    <div className="summary">
      <div className="summary-intro">
        <Lightbulb size={20} strokeWidth={2.5} />
        <div>
          <h3 className="summary-title">{title}</h3>
          <p className="summary-text">{intro}</p>
        </div>
      </div>
      <div className="summary-grid">
        {cards.map((card, index) => (
          <Card key={card.title} card={card} index={index} />
        ))}
      </div>
      <p className="summary-legend">
        Throughout this chapter:{" "}
        <DimChips dim={MASS} size="sm" /> mass, <DimChips dim={LENGTH} size="sm" /> length,{" "}
        <DimChips dim={TIME} size="sm" /> time.
      </p>
    </div>
  );
}

const MASS = dimVec({ M: 1 });
const LENGTH = dimVec({ L: 1 });
const TIME = dimVec({ T: 1 });
