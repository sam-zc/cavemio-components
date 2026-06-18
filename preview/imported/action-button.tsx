"use client";

// Local interactive fixture; no application services are called.

import { ActionButton } from "../../registry/components/action-button";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ActionButton
          labels={{
            idle: "Save changes",
            pending: "Saving…",
            success: "Saved",
            error: "Try again",
          }}
          action={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
