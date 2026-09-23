"use client";

// Local interactive fixture; no application services are called.

import { Checkout } from "../../registry/components/checkout";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Checkout
          lines={[
            { id: "linen", name: "Linen overshirt", price: 89, quantity: 1 },
          ]}
          deliveries={[
            {
              id: "standard",
              label: "Standard delivery",
              price: 8,
              detail: "3–5 working days",
              days: [3, 5],
            },
          ]}
          payment={
            <div className="imported-demo-card">
              Demo payment method · No payment is collected.
            </div>
          }
          onPlaceOrder={async () => ({ number: "DEMO-2026" })}
        />
      </div>
    </div>
  );
}
