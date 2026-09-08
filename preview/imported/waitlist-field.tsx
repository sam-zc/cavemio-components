"use client";

// Local interactive fixture; no application services are called.

import { WaitlistField } from "../../registry/components/waitlist-field";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <WaitlistField
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
