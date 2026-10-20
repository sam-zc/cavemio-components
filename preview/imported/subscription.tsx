"use client";

// Local interactive fixture; no application services are called.

import { Subscription } from "../../registry/components/subscription";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Subscription
          plan={{ name: "Pro", price: 24, interval: "month" }}
          status="active"
          periodStart="2026-10-01"
          periodEnd="2026-11-01"
          onPause={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onCancel={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onResume={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
