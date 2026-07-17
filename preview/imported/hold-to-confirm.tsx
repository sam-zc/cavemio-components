"use client";

// Local interactive fixture; no application services are called.

import { HoldToConfirm } from "../../registry/components/hold-to-confirm";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <HoldToConfirm
          labels={{
            idle: "Hold to archive",
            pending: "Archiving",
            success: "Archived",
          }}
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
