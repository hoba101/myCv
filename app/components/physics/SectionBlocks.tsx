import type { SectionBlock } from "@/app/lib/physics/types";
import DimensionExplorer from "./DimensionExplorer";
import FormulaLab from "./FormulaLab";
import ScaleSlider from "./ScaleSlider";
import Quiz from "./Quiz";
import ShortAnswerList from "./ShortAnswerList";
import SolvedExamples from "./SolvedExamples";
import TopicRenderer from "./TopicRenderer";
import UnitConverter from "./UnitConverter";
import VisualSummary from "./VisualSummary";

/**
 * Maps a block's `kind` to its component. Adding a new block type to
 * `SectionBlock` surfaces as a compile error here rather than silently
 * rendering nothing.
 */
export default function SectionBlocks({ blocks }: { blocks: SectionBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "summary":
            return (
              <VisualSummary
                key={index}
                title={block.title}
                intro={block.intro}
                cards={block.cards}
              />
            );

          case "topics":
            return <TopicRenderer key={index} topics={block.topics} />;

          case "lab":
            return (
              <FormulaLab
                key={index}
                title={block.lab.title}
                description={block.lab.description}
                presets={block.lab.presets}
              />
            );

          case "converter":
            return (
              <UnitConverter
                key={index}
                title={block.title}
                description={block.description}
              />
            );

          case "scaleSlider":
            return (
              <ScaleSlider key={index} title={block.title} description={block.description} />
            );

          case "explorer":
            return (
              <DimensionExplorer key={index} title={block.title} description={block.description} />
            );

          case "examples":
            return (
              <SolvedExamples key={index} heading={block.heading} examples={block.examples} />
            );

          case "quiz":
            return <Quiz key={index} quiz={block.quiz} />;

          case "shortAnswer":
            return (
              <ShortAnswerList key={index} heading={block.heading} items={block.items} />
            );
        }
      })}
    </>
  );
}
