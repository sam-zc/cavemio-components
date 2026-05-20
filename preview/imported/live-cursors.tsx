"use client";

// Local interactive fixture; no application services are called.

import { LiveCursors } from "../../registry/components/live-cursors";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LiveCursors
          cursors={[
            {
              id: "ada",
              name: "Ada",
              x: 0.42,
              y: 0.3,
              message: "Love this headline",
            },
            {
              id: "kai",
              name: "Kai",
              x: 0.7,
              y: 0.8,
              selection: { x: 0.36, y: 0.72, width: 0.28, height: 0.21 },
            },
          ]}
        >
          <div className="imported-demo-card h-64">
            <h3>Make room for a good idea.</h3>
            <p>Shared presence, right where the work happens.</p>
          </div>
        </LiveCursors>
      </div>
    </div>
  );
}
