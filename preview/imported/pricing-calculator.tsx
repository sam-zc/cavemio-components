"use client";

// Local interactive fixture; no application services are called.

import { PricingCalculator } from "../../registry/components/pricing-calculator";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PricingCalculator
          min={1000}
          max={1000000}
          scale="log"
          unit="monthly active users"
          valueFormat={{ notation: "compact" }}
          price={(users) => 29 + users * 0.003}
          plan={(users) => (users < 10000 ? "Starter" : "Growth")}
          marks={[{ value: 10000, label: "10K" }]}
          contactFrom={500000}
          yearlyDiscount={0.2}
        />
      </div>
    </div>
  );
}
