"use client";

// Local interactive fixture; no application services are called.

import { WorkflowCanvas } from "../../registry/components/workflow-canvas";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <WorkflowCanvas
          width={460}
          height={180}
          nodes={[
            {
              id: "input",
              title: "Receive brief",
              x: 20,
              y: 50,
              status: "complete",
            },
            {
              id: "draft",
              title: "Create draft",
              x: 270,
              y: 50,
              status: "running",
              detail: "Preparing a first draft.",
            },
          ]}
          edges={[{ id: "input-draft", from: "input", to: "draft" }]}
        />
      </div>
    </div>
  );
}
