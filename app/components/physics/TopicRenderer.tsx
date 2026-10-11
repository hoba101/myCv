import {
  BookMarked,
  Check,
  Info,
  KeyRound,
  TriangleAlert,
  Zap,
} from "lucide-react";
import type { Callout, Topic } from "@/app/lib/physics/types";

const CALLOUT_META: Record<
  Callout["kind"],
  { className: string; Icon: typeof Info; label: string }
> = {
  definition: { className: "callout-definition", Icon: BookMarked, label: "Definition" },
  note: { className: "callout-note", Icon: Info, label: "Note" },
  warning: { className: "callout-warning", Icon: TriangleAlert, label: "Watch out" },
  key: { className: "callout-key", Icon: KeyRound, label: "Key idea" },
  example: { className: "callout-example", Icon: Zap, label: "Example" },
};

function CalloutCard({ callout }: { callout: Callout }) {
  const meta = CALLOUT_META[callout.kind];
  const { Icon } = meta;

  return (
    <aside className={`callout ${meta.className}`}>
      <p className="callout-head">
        <Icon size={16} strokeWidth={2.5} />
        <span className="callout-label">{callout.title ?? meta.label}</span>
      </p>
      <p className="callout-body">{callout.body}</p>
      {callout.formula && (
        <p className="callout-formula">
          <code>{callout.formula}</code>
        </p>
      )}
    </aside>
  );
}

export default function TopicRenderer({ topics }: { topics: Topic[] }) {
  return (
    <div className="topics">
      {topics.map((topic) => {
        if (topic.kind === "callout" && topic.callout) {
          return <CalloutCard key={topic.id} callout={topic.callout} />;
        }

        if (topic.kind === "list" && topic.items) {
          return (
            <ul key={topic.id} className="checklist">
              {topic.items.map((item) => (
                <li key={item}>
                  <Check size={16} strokeWidth={3} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (topic.kind === "table" && topic.table) {
          const { caption, columns, rows } = topic.table;
          return (
            <div key={topic.id} className="table-wrap">
              <table className="table">
                <caption className="table-caption">{caption}</caption>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={`${row[0]}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={topic.id} className="prose">
            {topic.body}
          </p>
        );
      })}
    </div>
  );
}
