"use client";

// Local interactive fixture; no application services are called.

import { LiveActivity } from "../../registry/components/live-activity";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LiveActivity
          activity={{
            id: "export",
            label: "Editing 3 files",
            progress: 0.52,
            steps: [
              { label: "Plan the change", done: true },
              { label: "Edit 3 files" },
              { label: "Run the tests" },
            ],
          }}
        />
      </div>
    </div>
  );
}
