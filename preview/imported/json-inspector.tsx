"use client";

// Local interactive fixture; no application services are called.

import { JsonInspector } from "../../registry/components/json-inspector";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <JsonInspector
          title="invoice.paid"
          data={{
            id: "inv_demo_001",
            customer: { name: "Ada Okafor", plan: "Team" },
            amount: 2400,
            currency: "USD",
            paid: true,
            items: [{ description: "Team plan", quantity: 1 }],
          }}
        />
      </div>
    </div>
  );
}
