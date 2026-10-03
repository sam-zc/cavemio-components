"use client";

// Local interactive fixture; no application services are called.

import { EmptyState } from "../../registry/components/empty-state";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <EmptyState
          scene="inbox"
          title="No projects yet"
          description="Start one and invite your team."
          action={{
            label: "Create project",
            pendingLabel: "Creating",
            successLabel: "Created",
            onAction: async () => {
              await new Promise((resolve) => setTimeout(resolve, 650));
            },
          }}
        />
      </div>
    </div>
  );
}
