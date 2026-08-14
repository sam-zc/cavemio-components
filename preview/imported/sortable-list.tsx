"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { SortableList } from "../../registry/components/sortable-list";

export function Demo() {
  const [value, setValue] = useState([
    { id: "1", name: "Research the idea" },
    { id: "2", name: "Build a prototype" },
    { id: "3", name: "Share with the team" },
    { id: "4", name: "Ship the details" },
  ]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SortableList
          items={value}
          onReorder={setValue}
          getLabel={(item) => item.name}
          renderItem={(item) => (
            <span className="text-sm font-medium">{item.name}</span>
          )}
        />
      </div>
    </div>
  );
}
