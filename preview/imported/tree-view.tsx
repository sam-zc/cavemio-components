"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { TreeView } from "../../registry/components/tree-view";

export function Demo() {
  const [value, setValue] = useState([
    { id: "docs", parent: null as string | null, title: "Docs" },
    { id: "intro", parent: "docs", title: "Introduction", leaf: true },
    {
      id: "readme",
      parent: null as string | null,
      title: "README.md",
      leaf: true,
    },
  ]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TreeView
          nodes={value}
          onNodesChange={setValue}
          defaultExpanded={["docs"]}
        />
      </div>
    </div>
  );
}
