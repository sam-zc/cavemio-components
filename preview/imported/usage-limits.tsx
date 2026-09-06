"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { UsageLimits } from "../../registry/components/usage-limits";

export function Demo() {
  const [previewNow] = useState(() => Date.now());
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <UsageLimits
          plan="Team"
          context={{
            limit: 1000000,
            parts: [
              { id: "system", label: "System prompt", tokens: 14000 },
              { id: "chat", label: "Conversation", tokens: 548000 },
            ],
          }}
          limits={[
            {
              id: "window",
              label: "5-hour window",
              used: 38,
              limit: 100,
              resetsAt: previewNow + 3600000,
            },
          ]}
        />
      </div>
    </div>
  );
}
