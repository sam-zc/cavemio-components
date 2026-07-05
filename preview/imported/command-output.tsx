"use client";

// Local interactive fixture; no application services are called.

import { CommandOutput } from "../../registry/components/command-output";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CommandOutput
          command="bun run test"
          status="success"
          lines={[
            "✓ component registry validates",
            "✓ source imports resolve",
            "✓ preview fixture renders",
            "3 tests passed",
          ]}
        />
      </div>
    </div>
  );
}
