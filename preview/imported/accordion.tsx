"use client";

// Local interactive fixture; no application services are called.

import { Accordion } from "../../registry/components/accordion";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Accordion
          items={[
            {
              value: "shipping",
              title: "When does it ship?",
              content: "Orders ship within two working days.",
            },
            {
              value: "returns",
              title: "Can I return an order?",
              content: "You have 30 days to return your order.",
            },
          ]}
        />
      </div>
    </div>
  );
}
