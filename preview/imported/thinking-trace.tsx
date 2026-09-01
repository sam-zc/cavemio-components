"use client";

// Local interactive fixture; no application services are called.

import { ThinkingTrace } from "../../registry/components/thinking-trace";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ThinkingTrace
          variant="tools"
          status="running"
          steps={[
            { label: "Read", detail: "plans.ts" },
            {
              label: "Edit",
              detail: "PricingTable.tsx",
              additions: 74,
              deletions: 41,
            },
            { label: "Run", detail: "npm test", status: "running" },
          ]}
        />
      </div>
    </div>
  );
}
