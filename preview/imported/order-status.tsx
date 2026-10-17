"use client";

// Local interactive fixture; no application services are called.

import { OrderStatus } from "../../registry/components/order-status";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <OrderStatus
          number="DEMO-2026"
          status="shipped"
          eta="2026-10-30"
          carrier="Example delivery"
          tracking="DEMO123456"
          events={[]}
        />
      </div>
    </div>
  );
}
