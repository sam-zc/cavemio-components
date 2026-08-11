"use client";

// Local interactive fixture; no application services are called.

import { RatioBalancer } from "../../registry/components/ratio-balancer";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <RatioBalancer
          label="Compute allocation"
          defaultSegments={[
            { id: "eval", label: "Evaluation", ratio: 45 },
            { id: "batch", label: "Batch tasks", ratio: 35 },
            { id: "dev", label: "Dev testing", ratio: 20 },
          ]}
        />
      </div>
    </div>
  );
}
