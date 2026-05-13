"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ContextMenu } from "../../registry/components/context-menu";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ContextMenu
          items={[
            {
              id: "open",
              label: "Open",
              onSelect: () => setMessage("Opened project"),
            },
            {
              id: "delete",
              label: "Delete",
              destructive: true,
              onSelect: () => setMessage("Removed project"),
            },
          ]}
        >
          <div className="imported-demo-card">
            Right-click this project card
          </div>
        </ContextMenu>
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
