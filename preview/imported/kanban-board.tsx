"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { KanbanBoard } from "../../registry/components/kanban-board";

export function Demo() {
  const [value, setValue] = useState([
    { id: "1", column: "todo", title: "Explore the library" },
    { id: "2", column: "doing", title: "Build a prototype" },
    { id: "3", column: "done", title: "Set up the workspace" },
  ]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <KanbanBoard
          columns={[
            { id: "todo", title: "Todo" },
            { id: "doing", title: "In progress" },
            { id: "done", title: "Done", done: true },
          ]}
          cards={value}
          onCardsChange={setValue}
          renderCard={(issue) => <p className="text-sm">{issue.title}</p>}
        />
      </div>
    </div>
  );
}
