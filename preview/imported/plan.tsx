"use client";

// Local interactive fixture; no application services are called.

import { Plan } from "../../registry/components/plan";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Plan
          tasks={[
            { label: "Read the project brief", status: "done" },
            { label: "Compare the options", status: "running" },
            { label: "Draft the next steps", status: "pending" },
          ]}
        />
      </div>
    </div>
  );
}
